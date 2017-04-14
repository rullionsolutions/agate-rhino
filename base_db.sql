
TRUNCATE TABLE sy_number;
INSERT INTO sy_number ( _key, n ) VALUES ( 0, 0 );
INSERT INTO sy_number ( _key, n ) SELECT n+   1, n+   1 FROM sy_number;
INSERT INTO sy_number ( _key, n ) SELECT n+   2, n+   2 FROM sy_number;
INSERT INTO sy_number ( _key, n ) SELECT n+   4, n+   4 FROM sy_number;
INSERT INTO sy_number ( _key, n ) SELECT n+   8, n+   8 FROM sy_number;
INSERT INTO sy_number ( _key, n ) SELECT n+  16, n+  16 FROM sy_number;
INSERT INTO sy_number ( _key, n ) SELECT n+  32, n+  32 FROM sy_number;
INSERT INTO sy_number ( _key, n ) SELECT n+  64, n+  64 FROM sy_number;
INSERT INTO sy_number ( _key, n ) SELECT n+ 128, n+ 128 FROM sy_number;
INSERT INTO sy_number ( _key, n ) SELECT n+ 256, n+ 256 FROM sy_number;
INSERT INTO sy_number ( _key, n ) SELECT n+ 512, n+ 512 FROM sy_number;
INSERT INTO sy_number ( _key, n ) SELECT n+1024, n+1024 FROM sy_number;
INSERT INTO sy_number ( _key, n ) SELECT n+2048, n+2048 FROM sy_number;
INSERT INTO sy_number ( _key, n ) SELECT n+4096, n+4096 FROM sy_number;



DROP FUNCTION IF EXISTS GET_WORKING_DAYS;
DELIMITER |
CREATE FUNCTION GET_WORKING_DAYS ( sd varchar(10), ed varchar(10) )
 returns int
 deterministic
 begin
return 5 * (DATEDIFF(ed, sd) DIV 7) + MID('0123444401233334012222340111123400012345001234550', 7 * WEEKDAY(sd) + WEEKDAY(ed) + 1, 1);
 end|
DELIMITER ;

DROP FUNCTION IF EXISTS ADD_WORKING_DAYS;
DELIMITER |
CREATE FUNCTION ADD_WORKING_DAYS ( dt varchar(10), iv int )
 returns varchar(10)
deterministic
 begin
 declare rdt varchar(10);
 declare n int;
 declare w int;

 set n = 1;
  set rdt = date_add( dt, interval n day );
 set w = get_working_days( dt, rdt );

 while iv <> w do
set n=n+1;
 set rdt = date_add( dt, interval n day );
 set w = get_working_days( dt, rdt );
 end while;
 return rdt;
 end|
DELIMITER ;

delimiter ;
drop function if exists get_working_time;
delimiter |
CREATE
  FUNCTION get_working_time
  (
    start_datetime           DATETIME,
    finish_datetime          DATETIME,
 start_working_hour_time  TIME,
 finish_working_hour_time TIME,
 unit_of_measure varchar(2)
  ) RETURNS FLOAT
  /*) returns blob*/
BEGIN
  /*
   * Variables ...
   */
  DECLARE result_time                       FLOAT;
  DECLARE working_hour_per_day              FLOAT;
  DECLARE fulldays_between_start_finish     INTEGER;
  DECLARE holiday_days_between              INTEGER;
  DECLARE is_start_datetime_a_holiday       TINYINT;
  DECLARE is_finish_datetime_a_holiday      TINYINT;
  DECLARE working_time_start_date           TIME;
  DECLARE working_time_finish_date          TIME;
  DECLARE days_between_start_finish         INTEGER;
  DECLARE first_full_date                   DATE;
  DECLARE last_full_date                    DATE;
  DECLARE first_full_date_w                 TINYINT;
  DECLARE last_full_date_w                  TINYINT;
  DECLARE tmp_dttm                          DATETIME;
  DECLARE neg                               TINYINT;
  /* working_hour_per_day */
  IF start_working_hour_time IS NULL OR finish_working_hour_time IS NULL THEN
    SET working_hour_per_day = 24;
  ELSE
    SET working_hour_per_day = HOUR(  TIMEDIFF(start_working_hour_time, finish_working_hour_time))
                             + MINUTE(TIMEDIFF(start_working_hour_time, finish_working_hour_time)) /60 ;
  END IF;

  /*Set Default working hours to full day if null*/
  if start_working_hour_time is null then
    set start_working_hour_time = '00:00:00';
  end if;
  if finish_working_hour_time is null then
    set finish_working_hour_time = '23:59:59';
  end if;

  IF start_datetime > finish_datetime THEN
    /*Switch and use neg to return negative value*/
    set tmp_dttm = start_datetime;
    set start_datetime = finish_datetime;
    set finish_datetime = tmp_dttm;
    set neg = 1;
  ELSE
    set neg = 0;
  END IF;

  /*Shift date/time if outside business hours*/
  set start_datetime = if(start_datetime < concat(date(start_datetime),' ',ifnull(start_working_hour_time,'23:59:99')),concat(date(start_datetime),' ',ifnull(start_working_hour_time,'23:59:99')),start_datetime);
  set start_datetime = if(start_datetime > concat(date(start_datetime),' ',ifnull(finish_working_hour_time,'23:59:99')),concat(date(start_datetime),' ',ifnull(finish_working_hour_time,'23:59:99')),start_datetime);
  set finish_datetime = if(finish_datetime > concat(date(finish_datetime),' ',ifnull(finish_working_hour_time,'23:59:99')),concat(date(finish_datetime),' ',ifnull(finish_working_hour_time,'23:59:99')),finish_datetime);
  set finish_datetime = if(finish_datetime < concat(date(finish_datetime),' ',ifnull(start_working_hour_time,'23:59:99')),concat(date(finish_datetime),' ',ifnull(start_working_hour_time,'23:59:99')),finish_datetime);

  /*Shift weekend start and finish*/
  if DATE_FORMAT(start_datetime, '%w') = 6 then/* Sat */
    set start_datetime = concat(date(date_add(start_datetime, interval 2 day)),' ',start_working_hour_time);
  elseif DATE_FORMAT(start_datetime, '%w') = 0 then/* Sun */
    set start_datetime = concat(date(date_add(start_datetime, interval 1 day)),' ',start_working_hour_time);
  end if;

  if DATE_FORMAT(finish_datetime, '%w') = 6 then/* Sat */
    set finish_datetime = concat(date(date_add(finish_datetime, interval 2 day)),' ',start_working_hour_time);
  elseif DATE_FORMAT(start_datetime, '%w') = 0 then/* Sun */
    set finish_datetime = concat(date(date_add(finish_datetime, interval 1 day)),' ',start_working_hour_time);
  end if;

  /*Get week days e.g. 11/09/13-15/09/13 is 3 days*/
  /*TODO - Calculate days_between_start_finish as 'weekdays'*/
  set fulldays_between_start_finish = (5 * (DATEDIFF(date(finish_datetime), date(start_datetime)) DIV 7) + MID('0123444401233334012222340111123400012345001234550', 7 * WEEKDAY(date(start_datetime)) + WEEKDAY(date(finish_datetime)) + 1, 1)) + 1;

  /*TODO If start is not weekend decrement weekdays by 1*/
  if DATE_FORMAT(date(start_datetime), '%w') <> 6 /* Sat */  and DATE_FORMAT(date(start_datetime), '%w') <> 0 /* Sun */ then
    set fulldays_between_start_finish = fulldays_between_start_finish-1;
  end if;
  /*TODO If finish is not weekend decrement weekdays by 1*/
  if DATE_FORMAT(date(finish_datetime), '%w') <> 6 /* Sat */  and DATE_FORMAT(date(finish_datetime), '%w') <> 0 /* Sun */ then
    set fulldays_between_start_finish = fulldays_between_start_finish-1;
  end if;

  /*If both start and finish are weekend set to fulldays to zero*/
  if (DATE_FORMAT(date(start_datetime), '%w') = 6 /* Sat */  or DATE_FORMAT(date(start_datetime), '%w') = 0 /* Sun */) and ( DATE_FORMAT(date(finish_datetime), '%w') = 6 /* Sat */  or DATE_FORMAT(date(finish_datetime), '%w') = 0 /* Sun */) then
    set fulldays_between_start_finish = 0;
  end if;
  /*If start and finish dates are the same then days is zero*/
  if date(start_datetime) = date(finish_datetime) then
    set fulldays_between_start_finish = 0;
  end if;

  SET holiday_days_between = ( SELECT COUNT(*) FROM   rp_holiday WHERE  date > date(start_datetime) AND date < date(finish_datetime) );

  /* is_start_datetime_a_holiday and is_finish_datetime_a_holiday */
  SET is_start_datetime_a_holiday  = (
                                      SELECT IF( count(*) > 0, 1, 0)
                                      FROM   rp_holiday
                                      WHERE  date = date(start_datetime)
                                     );
  SET is_finish_datetime_a_holiday = (
                                      SELECT IF( count(*) > 0, 1, 0)
                                      FROM   rp_holiday
                                      WHERE  date = date(finish_datetime)
                                     );
  /* working_time_start_date */
  SET working_time_start_date = '00:00:00';
  IF is_start_datetime_a_holiday = 0  AND DATE_FORMAT(start_datetime, '%w') <> 6 /* Sat */  AND DATE_FORMAT(start_datetime, '%w') <> 0 /* Sun */ THEN
    IF finish_working_hour_time IS NULL THEN
      SET working_time_start_date = TIMEDIFF( TIME('24:00:00'), TIME(start_datetime) );
 ELSEIF TIME(start_datetime) > finish_working_hour_time  THEN
      SET working_time_start_date = '00:00:00';
    ELSE
      SET working_time_start_date = TIMEDIFF( finish_working_hour_time, TIME(start_datetime) );
    END IF;
  END IF;
  /* working_time_finish_date */
  SET working_time_finish_date = '00:00:00';
  IF is_finish_datetime_a_holiday = 0  AND DATE_FORMAT(finish_datetime, '%w') <> 6 /* Sat */  AND DATE_FORMAT(finish_datetime, '%w') <> 0 /* Sun */ THEN
    IF start_working_hour_time IS NULL THEN
      SET working_time_finish_date = TIMEDIFF( TIME(finish_datetime), '00:00:00' );
 ELSEIF TIME(finish_datetime) < start_working_hour_time  THEN
      SET working_time_finish_date = '00:00:00';
    ELSE
      SET working_time_finish_date = TIMEDIFF( TIME(finish_datetime), start_working_hour_time );
    END IF;
  END IF;

  /*Start & finish are same date*/
if date(start_datetime)=date(finish_datetime) and ( is_finish_datetime_a_holiday = 0  AND DATE_FORMAT(finish_datetime, '%w') <> 6 AND DATE_FORMAT(finish_datetime, '%w') <> 0 ) then
  SET working_time_start_date = timediff(finish_datetime,start_datetime);
  SET working_time_finish_date = '00:00:00';
end if;
  /* return elapsed working hours between 2 dates, considering a specific working time-frame */
    set result_time =  ( fulldays_between_start_finish - holiday_days_between ) * working_hour_per_day + HOUR( working_time_start_date )  + MINUTE( working_time_start_date )/60 + SECOND(working_time_start_date)/3600 + HOUR( working_time_finish_date ) + MINUTE( working_time_finish_date )/60  + SECOND(working_time_finish_date)/3600;
    IF unit_of_measure = 'D' THEN
      set result_time =  result_time / working_hour_per_day;
    END IF;

    /*return concat( 'r: ',result_time,'; s: ',start_datetime,'; f: ',finish_datetime,'; n: ',neg,'; f: ',fulldays_between_start_finish,'; h: ',holiday_days_between,';','days: ',( fulldays_between_start_finish - holiday_days_between ),'; wh: ',working_hour_per_day, '; wt_s: ',working_time_start_date,'[',(HOUR( working_time_start_date )  + MINUTE( working_time_start_date )/60 + SECOND(working_time_start_date)/3600),']; wt_f: ',working_time_finish_date,'[',(HOUR( working_time_finish_date )  + MINUTE( working_time_finish_date )/60 + second(working_time_finish_date)/3600),'];wt_t:',((HOUR( working_time_start_date )  + MINUTE( working_time_start_date )/60 + SECOND(working_time_start_date)/3600) + (HOUR( working_time_finish_date )  + MINUTE( working_time_finish_date )/60 + SECOND(working_time_finish_date)/3600)),';');*/
    if neg=1 and result_time <> 0 then
      return result_time*-1;
    else
      return result_time;
    end if;
END;/* CREATE FUNCTION */
|
delimiter ;

DROP FUNCTION IF EXISTS ADD_WORKING_TIME;
DELIMITER |
CREATE FUNCTION ADD_WORKING_TIME ( dt DATETIME, iv float, start_working_hour_time  TIME, finish_working_hour_time TIME, unit_of_measure varchar(2) )
 returns DATETIME
 /*returns blob*/
deterministic
 begin
 declare rdt DATETIME;
 declare n float;
 declare w float;
 DECLARE is_holiday TINYINT;
 /*declare debug blob;*/

 if iv < 0 then
  return null;
 elseif iv = 0 then
  return dt;
 end if;

 /*set debug = '**Debug Output**\n';*/

 /*Amend date if outside business hours*/
 if start_working_hour_time is not null and dt < concat(date(dt),' ',start_working_hour_time) then
   set dt = concat(date(dt),' ',start_working_hour_time);
 elseif finish_working_hour_time is not null and dt > concat(date(dt),' ',finish_working_hour_time) then
   set dt = concat(date(dt),' ',finish_working_hour_time);
 end if;

 set n = 1;
 IF unit_of_measure = 'H' THEN
 set rdt = date_add( dt, interval n hour );
 ELSE
 set rdt = date_add( dt, interval n day );
 END IF;
 set w = get_working_time( dt, rdt, start_working_hour_time, finish_working_hour_time, unit_of_measure );
 /*set debug = CONCAT_WS('\n', debug,concat(' n:',n,'; d:',rdt,'; w:',w,';'));*/
 while iv <> w do
set n=n+1;
 IF unit_of_measure = 'H' THEN
 set rdt = date_add( dt, interval n hour );
 ELSE
 set rdt = date_add( dt, interval n day );
 END IF;
 SET is_holiday = (
  SELECT IF( count(*) > 0, 1, 0)
  FROM   rp_holiday
  WHERE  date = date(rdt)
 );
 IF is_holiday=0 AND DATE_FORMAT(rdt, '%w') NOT IN ( 0, 6) THEN
 set w = get_working_time( dt, rdt, start_working_hour_time, finish_working_hour_time, unit_of_measure );
 /*set debug = concat(debug,' n:',n,'; d:',rdt,'; w:',w,';');*/
 END IF;
 /*
 IF n=30 then
 return debug;
 end if;*/
 end while;
 /*return debug;*/
 return rdt;
 end
|
DELIMITER ;

DROP FUNCTION IF EXISTS SUB_WORKING_TIME;
DELIMITER |
CREATE FUNCTION SUB_WORKING_TIME ( dt DATETIME, iv float, start_working_hour_time  TIME, finish_working_hour_time TIME, unit_of_measure varchar(2) )
 returns DATETIME
 /*returns blob*/
deterministic
 begin
 declare rdt DATETIME;
 declare n float;
 declare w float;
 DECLARE is_holiday TINYINT;
 /*declare debug blob;*/

 if iv < 0 then
  return null;
 elseif iv = 0 then
  return dt;
 end if;

 /*set debug = '**Debug Output**\n';*/

 /*Amend date if outside business hours*/
 if start_working_hour_time is not null and dt < concat(date(dt),' ',start_working_hour_time) then
   set dt = concat(date(dt),' ',start_working_hour_time);
 elseif finish_working_hour_time is not null and dt > concat(date(dt),' ',finish_working_hour_time) then
   set dt = concat(date(dt),' ',finish_working_hour_time);
 end if;

 set n = 1;
 IF unit_of_measure = 'H' THEN
 set rdt = date_sub( dt, interval n hour );
 ELSE
 set rdt = date_sub( dt, interval n day );
 END IF;
 set w = get_working_time( dt, rdt, start_working_hour_time, finish_working_hour_time, unit_of_measure );
 /*set debug = concat(debug,' n:',n,'; d:',rdt,'; w:',w,';\n');*/
 while (-1*iv) <> w do
set n=n+1;
 IF unit_of_measure = 'H' THEN
 set rdt = date_sub( dt, interval n hour );
 ELSE
 set rdt = date_sub( dt, interval n day );
 END IF;
 SET is_holiday = (
  SELECT IF( count(*) > 0, 1, 0)
  FROM   rp_holiday
  WHERE  date = date(rdt)
 );
 IF is_holiday=0 AND DATE_FORMAT(rdt, '%w') NOT IN ( 0, 6) THEN
 set w = get_working_time( dt, rdt, start_working_hour_time, finish_working_hour_time, unit_of_measure );
 /*set debug = concat(debug,' n:',n,'; d:',rdt,'; w:',w,'; iv: ',(-1*iv),'; o: ',if((-1*iv)=w,'Y','N'),';\n');*/
 END IF;

 /*IF n > (iv+5) then
 set debug = concat(debug,'**FAILED**');
 return debug;
 return null;
 end if;*/
 end while;
 /*set debug = concat('Result: ',rdt,'',debug,'\n');*/
 /*return debug;*/
 return rdt;
 end
|
DELIMITER ;


DROP FUNCTION IF EXISTS GET_HIGHCHARTS_TIME;
DELIMITER |
CREATE FUNCTION GET_HIGHCHARTS_TIME ( dt DATETIME )
 returns INT
deterministic
 begin
 return UNIX_TIMESTAMP(dt) + 3600;
 end
|
DELIMITER ;
