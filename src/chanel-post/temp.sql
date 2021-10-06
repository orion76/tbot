SELECT `m`.`title` AS `m_title`,
 `m`.`deleted` AS `m_deleted`,
 `m`.`data` AS `m_data`,
 `m`.`id` AS `m_id`,
 `m`.`message_id` AS `m_message_id`,
 `m`.`chat_id` AS `m_chat_id`,
 `m`.`date` AS `m_date`,
 `m`.`text` AS `m_text`,
 `message_ref`.`id` AS `message_ref_id`,
 `message_ref`.`type` AS `message_ref_type`,
 `message_ref`.`source_id` AS `message_ref_source_id`,
 `message_ref`.`target_id` AS `message_ref_target_id`,
 `message_ref_target`.`title` AS `message_ref_target_title`,
 `message_ref_target`.`deleted` AS `message_ref_target_deleted`,
 `message_ref_target`.`data` AS `message_ref_target_data`,
 `message_ref_target`.`id` AS `message_ref_target_id`,
 `message_ref_target`.`message_id` AS `message_ref_target_message_id`,
 `message_ref_target`.`chat_id` AS `message_ref_target_chat_id`,
 `message_ref_target`.`date` AS `message_ref_target_date`,
 `message_ref_target`.`text` AS `message_ref_target_text`,
 `user_ref`.`id` AS `user_ref_id`,
 `user_ref`.`type` AS `user_ref_type`,
 `user_ref`.`source_id` AS `user_ref_source_id`,
 `user_ref`.`target_id` AS `user_ref_target_id`,
 `chat_ref`.`id` AS `chat_ref_id`,
 `chat_ref`.`type` AS `chat_ref_type`,
 `chat_ref`.`source_id` AS `chat_ref_source_id`,
 `chat_ref`.`target_id` AS `chat_ref_target_id` FROM `tg_message` `m` 
 LEFT JOIN `tg_message_ref` `message_ref` ON `message_ref`.`source_id`=`m`.`id`  
 LEFT JOIN `tg_message` `message_ref_target` ON `message_ref_target`.`id`=`message_ref`.`target_id`  
 LEFT JOIN `tg_user_ref` `user_ref` ON `user_ref`.`source_id`=`m`.`id`  
 LEFT JOIN `tg_chat_ref` `chat_ref` ON `chat_ref`.`source_id`=`m`.`id` WHERE `m`.`id`=? -
