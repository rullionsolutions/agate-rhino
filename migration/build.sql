
INSERT INTO sy_list (_key, _tx, area, id, title) VALUES
    ('sy.migration_status', null, 'sy', 'migration_status', 'Migration');


INSERT INTO sy_list_item (_key, _tx, seq_number, list, id, text, active, from_value, to_value) VALUES
    ('sy.migration_status.S', null, '1', 'sy.migration_status', 'S', 'started', 'A', null, null),
    ('sy.migration_status.C', null, '2', 'sy.migration_status', 'C', 'completed', 'A', null, null),
    ('sy.migration_status.F', null, '3', 'sy.migration_status', 'F', 'failed', 'A', null, null);
