INSERT INTO sy_list_item (_key, _tx, seq_number, list, id, text, active, from_value, to_value) VALUES 
	('sy.active.A', null, '10', 'sy.active', 'A', 'active', 'A', null, null), 
	('sy.active.I', null, '20', 'sy.active', 'I', 'inactive', 'A', null, null), 
	('sy.duration.days', null, '10', 'sy.duration', 'days', 'week-days', 'A', null, null), 
	('sy.duration.weeks', null, '20', 'sy.duration', 'weeks', 'weeks', 'A', null, null), 
	('sy.duration.months', null, '30', 'sy.duration', 'months', 'months', 'A', null, null), 
	('sy.aggregation.A', null, '1', 'sy.aggregation', 'A', 'average', 'A', null, null), 
	('sy.aggregation.C', null, '2', 'sy.aggregation', 'C', 'count', 'A', null, null), 
	('sy.aggregation.N', null, '3', 'sy.aggregation', 'N', 'none', 'A', null, null), 
	('sy.aggregation.S', null, '4', 'sy.aggregation', 'S', 'sum', 'A', null, null), 
	('sy.edit_type.A', null, '1', 'sy.edit_type', 'A', 'allow blanks', 'A', null, null), 
	('sy.edit_type.E', null, '2', 'sy.edit_type', 'E', 'editable', 'A', null, null), 
	('sy.edit_type.H', null, '3', 'sy.edit_type', 'H', 'hidden', 'A', null, null), 
	('sy.edit_type.U', null, '4', 'sy.edit_type', 'U', 'uneditable', 'A', null, null),
	('sy.migration_status.S', null, '1', 'sy.migration_status', 'S', 'started', 'A', null, null),
	('sy.migration_status.C', null, '2', 'sy.migration_status', 'C', 'completed', 'A', null, null),
	('sy.migration_status.F', null, '3', 'sy.migration_status', 'F', 'failed', 'A', null, null), 
	('sy.msg_type.D', null, '4', 'sy.msg_type', 'D', 'debug', 'A', null, null), 
	('sy.msg_type.E', null, '1', 'sy.msg_type', 'E', 'error', 'A', null, null), 
	('sy.msg_type.I', null, '3', 'sy.msg_type', 'I', 'information', 'A', null, null), 
	('sy.msg_type.N', null, '5', 'sy.msg_type', 'N', 'email notification', 'A', null, null), 
	('sy.msg_type.W', null, '2', 'sy.msg_type', 'W', 'warning', 'A', null, null), 
    ('sy.node_attributes.ST', null, '10', 'sy.node_attributes', 'ST', 'show in taskbar', 'A', null, null), 
	('sy.node_attributes.AU', null, '20', 'sy.node_attributes', 'AU', 'automatic', 'A', null, null), 
	('sy.node_attributes.SU', null, '30', 'sy.node_attributes', 'SU', 'skip if no assigned user on activation', 'A', null, null), 
	('sy.node_attributes.OA', null, '40', 'sy.node_attributes', 'OA', 'override actor', 'A', null, null), 
    ('sy.node_attributes.PD', null, '50', 'sy.node_attributes', 'PD', 'prevent delegation', 'A', null, null), 
    ('sy.node_attributes.SN', null, '60', 'sy.node_attributes', 'SN', 'skip notification', 'A', null, null), 
    ('sy.node_attributes.SM', null, '70', 'sy.node_attributes', 'SM', 'suppress activation message', 'A', null, null), 
	('sy.node_attributes.OT', null, '80', 'sy.node_attributes', 'OT', 'one time link execution', 'A', null, null),
	('sy.node_attributes.SP', null, '90', 'sy.node_attributes', 'SP', 'separate process', 'A', null, null),
	('sy.search_oper_list_attr.AL', null, '20', 'sy.search_oper_list_attr', 'AL', 'all of', 'A', null, null), 
	('sy.search_oper_list_attr.AN', null, '10', 'sy.search_oper_list_attr', 'AN', 'any of', 'A', null, null), 
	('sy.search_oper_list_boolean.EQ', null, '10', 'sy.search_oper_list_boolean', 'EQ', 'equals', 'A', null, null), 
	('sy.search_oper_list_date.EQ', null, '10', 'sy.search_oper_list_date', 'EQ', 'equals', 'A', null, null),
	('sy.search_oper_list_date.GE', null, '30', 'sy.search_oper_list_date', 'GE', 'on/after', 'A', null, null),
	('sy.search_oper_list_date.LE', null, '40', 'sy.search_oper_list_date', 'LE', 'on/before', 'A', null, null),
	('sy.search_oper_list_date.NE', null, '20', 'sy.search_oper_list_date', 'NE', 'does not equal', 'A', null, null),
	('sy.search_oper_list_keyword.KW', null, '10', 'sy.search_oper_list_keyword', 'KW', 'contains words', 'A', null, null), 
	('sy.search_oper_list_number.EQ', null, '10', 'sy.search_oper_list_number', 'EQ', 'equals', 'A', null, null),
	('sy.search_oper_list_number.GE', null, '30', 'sy.search_oper_list_number', 'GE', 'greater than/equals', 'A', null, null),
	('sy.search_oper_list_number.LE', null, '40', 'sy.search_oper_list_number', 'LE', 'less than/equals', 'A', null, null),
	('sy.search_oper_list_number.NE', null, '20', 'sy.search_oper_list_number', 'NE', 'does not equal', 'A', null, null),
	('sy.search_oper_list_option.EQ', null, '10', 'sy.search_oper_list_option', 'EQ', 'equals', 'A', null, null), 
	('sy.search_oper_list_option.NE', null, '20', 'sy.search_oper_list_option', 'NE', 'does not equal', 'A', null, null),
	('sy.search_oper_list_radius.LT', null, '10', 'sy.search_oper_list_radius', 'LT', 'within', 'A', null, null), 
	('sy.search_oper_list_scalar.EQ', null, '10', 'sy.search_oper_list_scalar', 'EQ', 'equals', 'A', null, null),
	('sy.search_oper_list_scalar.GT', null, '30', 'sy.search_oper_list_scalar', 'GT', 'greater than', 'A', null, null),
	('sy.search_oper_list_scalar.LT', null, '40', 'sy.search_oper_list_scalar', 'LT', 'less than', 'A', null, null),
	('sy.search_oper_list_scalar.NE', null, '20', 'sy.search_oper_list_scalar', 'NE', 'does not equal', 'A', null, null),
	('sy.search_oper_list_subent.HA', null, '10', 'sy.search_oper_list_subent', 'HA', 'has', 'A', null, null), 
	('sy.search_oper_list_subent.DH', null, '20', 'sy.search_oper_list_subent', 'DH', 'doesn''t have', 'A', null, null), 
	('sy.search_oper_list_text.BE', null, '30', 'sy.search_oper_list_text', 'BE', 'begins with', 'A', null, null), 
	('sy.search_oper_list_text.BN', null, '40', 'sy.search_oper_list_text', 'BN', 'does not begin with', 'A', null, null), 
	('sy.search_oper_list_text.CO', null, '10', 'sy.search_oper_list_text', 'CO', 'contains', 'A', null, null), 
	('sy.search_oper_list_text.DC', null, '20', 'sy.search_oper_list_text', 'DC', 'does not contain', 'A', null, null), 
	('sy.search_oper_list_text.EQ', null, '50', 'sy.search_oper_list_text', 'EQ', 'equals', 'A', null, null), 
	('sy.search_oper_list_text.NE', null, '60', 'sy.search_oper_list_text', 'NE', 'does not equal', 'A', null, null), 
	('sy.week_days.1', null, '10', 'sy.week_days', '1', 'Sunday', 'A', null, null), 
	('sy.week_days.2', null, '20', 'sy.week_days', '2', 'Monday', 'A', null, null), 
	('sy.week_days.3', null, '30', 'sy.week_days', '3', 'Tuesday', 'A', null, null), 
	('sy.week_days.4', null, '40', 'sy.week_days', '4', 'Wednesday', 'A', null, null), 
	('sy.week_days.5', null, '50', 'sy.week_days', '5', 'Thursday', 'A', null, null), 
	('sy.week_days.6', null, '60', 'sy.week_days', '6', 'Friday', 'A', null, null), 
	('sy.week_days.7', null, '70', 'sy.week_days', '7', 'Saturday', 'A', null, null), 
	('sy.wf_ntfcn_lvl.H', null, '20', 'sy.wf_ntfcn_lvl', 'H', 'high', 'A', null, null), 
	('sy.wf_ntfcn_lvl.L', null, '40', 'sy.wf_ntfcn_lvl', 'L', 'low', 'A', null, null), 
	('sy.wf_ntfcn_lvl.M', null, '30', 'sy.wf_ntfcn_lvl', 'M', 'medium', 'A', null, null), 
	('sy.wf_ntfcn_lvl.N', null, '50', 'sy.wf_ntfcn_lvl', 'N', 'none', 'A', null, null), 
	('sy.wf_ntfcn_lvl.V', null, '10', 'sy.wf_ntfcn_lvl', 'V', 'very high', 'A', null, null), 
	('sy.year.2010', null, '2010', 'sy.year', '2010', '2010', 'A', null, null), 
	('sy.year.2011', null, '2011', 'sy.year', '2011', '2011', 'A', null, null), 
	('sy.year.2012', null, '2012', 'sy.year', '2012', '2012', 'A', null, null), 
	('sy.year.2013', null, '2013', 'sy.year', '2013', '2013', 'A', null, null), 
	('sy.year.2014', null, '2014', 'sy.year', '2014', '2014', 'A', null, null), 
	('sy.year.2015', null, '2015', 'sy.year', '2015', '2015', 'A', null, null), 
	('sy.yesno.N', null, '20', 'sy.yesno', 'N', 'no', 'A', null, null), 
	('sy.yesno.Y', null, '10', 'sy.yesno', 'Y', 'yes', 'A', null, null);
