ALTER TABLE event_recorder_mj ALTER COLUMN mach_id VARCHAR(5);
UPDATE event_recorder_mj SET mach_id='0' + mach_id WHERE len(mach_id)=4;
ALTER TABLE event_recorder ALTER COLUMN mach_id VARCHAR(5);
UPDATE event_recorder SET mach_id='0' + mach_id WHERE len(mach_id)=4;
ALTER TABLE mng_subsidy_windepart ALTER COLUMN win_id VARCHAR(5);
--以下只能执行一次
--UPDATE mj_card_using SET card_id = SUBSTRING(card_id,7,2)+ SUBSTRING(card_id,5,2)+ SUBSTRING(card_id,3,2)+SUBSTRING(card_id,1,2);
--UPDATE event_recorder_mj SET event_cardid=SUBSTRING(event_cardid,7,2)+ SUBSTRING(event_cardid,5,2)+ SUBSTRING(event_cardid,3,2)+SUBSTRING(event_cardid,1,2);
--UPDATE event_recorder SET event_cardid=SUBSTRING(event_cardid,7,2)+ SUBSTRING(event_cardid,5,2)+ SUBSTRING(event_cardid,3,2)+SUBSTRING(event_cardid,1,2);