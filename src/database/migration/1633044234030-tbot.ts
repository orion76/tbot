import {MigrationInterface, QueryRunner} from "typeorm";

export class tbot1633044234030 implements MigrationInterface {
    name = 'tbot1633044234030'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`tbot_dev\`.\`message_type\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tbot_dev\`.\`tag\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`parentId\` bigint NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tbot_dev\`.\`tg_user\` (\`title\` varchar(255) NOT NULL, \`deleted\` tinyint NOT NULL DEFAULT 0, \`id\` varchar(255) NOT NULL, \`is_bot\` tinyint NOT NULL DEFAULT 0, \`first_name\` varchar(255) NULL, \`username\` varchar(255) NULL, INDEX \`IDX_abf9e9b6b169d0c9a5d2918951\` (\`first_name\`), INDEX \`IDX_1d3970f1a8c4bc96e5a2d208d6\` (\`username\`), INDEX \`IDX_19d1314dc427bfe79457b2e9a0\` (\`is_bot\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tbot_dev\`.\`tg_message\` (\`title\` varchar(255) NOT NULL, \`deleted\` tinyint NOT NULL DEFAULT 0, \`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`message_id\` bigint UNSIGNED NOT NULL, \`chatId\` varchar(255) NOT NULL, \`fromId\` varchar(255) NOT NULL, \`date\` int NOT NULL, \`text\` varchar(255) NOT NULL, \`forwardFromId\` varchar(255) NULL, \`senderChatId\` varchar(255) NULL, \`forwardFromChatId\` varchar(255) NULL, \`threadId\` bigint UNSIGNED NULL, \`replyToMessageId\` bigint UNSIGNED NULL, \`forwardFromMessageId\` bigint UNSIGNED NULL, INDEX \`IDX_a0fb118a88c9672247eb882bd8\` (\`date\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tbot_dev\`.\`tg_chat\` (\`title\` varchar(255) NOT NULL, \`deleted\` tinyint NOT NULL DEFAULT 0, \`id\` varchar(255) NOT NULL, \`type\` varchar(255) NOT NULL, \`username\` varchar(255) NOT NULL, INDEX \`IDX_6f1d39bfaf0a904434519faad9\` (\`username\`), INDEX \`IDX_e379826ce952332910da6551e6\` (\`type\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tbot_dev\`.\`tg_config\` (\`id\` int UNSIGNED NOT NULL, \`title\` varchar(255) NOT NULL, \`chat_id\` bigint NOT NULL, \`channel_id\` bigint NOT NULL, \`config\` longtext NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tbot_dev\`.\`tg_message_tags_tag\` (\`tgMessageId\` bigint UNSIGNED NOT NULL, \`tagId\` bigint NOT NULL, INDEX \`IDX_80ae64fa3b8b1a6846bfe1d9ce\` (\`tgMessageId\`), INDEX \`IDX_b9b94544fe88423dbdd512586e\` (\`tagId\`), PRIMARY KEY (\`tgMessageId\`, \`tagId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tbot_dev\`.\`tg_message_type_message_type\` (\`tgMessageId\` bigint UNSIGNED NOT NULL, \`messageTypeId\` bigint UNSIGNED NOT NULL, INDEX \`IDX_2bf7f6d7ec7ab7b129bfce1004\` (\`tgMessageId\`), INDEX \`IDX_8a1dc8f0d2ca9b3292eb6618f1\` (\`messageTypeId\`), PRIMARY KEY (\`tgMessageId\`, \`messageTypeId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tbot_dev\`.\`tag_closure\` (\`id_ancestor\` bigint NOT NULL, \`id_descendant\` bigint NOT NULL, INDEX \`IDX_32bf6c25aa9e397fe11403b314\` (\`id_ancestor\`), INDEX \`IDX_e59d05669a7d8259abc4b319d8\` (\`id_descendant\`), PRIMARY KEY (\`id_ancestor\`, \`id_descendant\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`tbot_dev\`.\`tag\` ADD CONSTRAINT \`FK_5f4effb7cd258ffa9ef554cfbbb\` FOREIGN KEY (\`parentId\`) REFERENCES \`tbot_dev\`.\`tag\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tbot_dev\`.\`tg_message\` ADD CONSTRAINT \`FK_b4fb6011e246c0a48800e702542\` FOREIGN KEY (\`chatId\`) REFERENCES \`tbot_dev\`.\`tg_chat\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tbot_dev\`.\`tg_message\` ADD CONSTRAINT \`FK_acdc1271e7c76f9f00160ede0b5\` FOREIGN KEY (\`fromId\`) REFERENCES \`tbot_dev\`.\`tg_user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tbot_dev\`.\`tg_message\` ADD CONSTRAINT \`FK_553162a54d2dc32b2dd96b46da9\` FOREIGN KEY (\`forwardFromId\`) REFERENCES \`tbot_dev\`.\`tg_user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tbot_dev\`.\`tg_message\` ADD CONSTRAINT \`FK_e367408401e471571be0afee0a7\` FOREIGN KEY (\`senderChatId\`) REFERENCES \`tbot_dev\`.\`tg_chat\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tbot_dev\`.\`tg_message\` ADD CONSTRAINT \`FK_4771752d966a175b8be2442eb63\` FOREIGN KEY (\`forwardFromChatId\`) REFERENCES \`tbot_dev\`.\`tg_chat\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tbot_dev\`.\`tg_message\` ADD CONSTRAINT \`FK_fdcf0a55eb8301c3bfcb1173a88\` FOREIGN KEY (\`threadId\`) REFERENCES \`tbot_dev\`.\`tg_message\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tbot_dev\`.\`tg_message\` ADD CONSTRAINT \`FK_30d9b1f1dd6bd2e886a46c018dd\` FOREIGN KEY (\`replyToMessageId\`) REFERENCES \`tbot_dev\`.\`tg_message\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tbot_dev\`.\`tg_message\` ADD CONSTRAINT \`FK_e131ff5692667bb5e9b34893955\` FOREIGN KEY (\`forwardFromMessageId\`) REFERENCES \`tbot_dev\`.\`tg_message\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tbot_dev\`.\`tg_message_tags_tag\` ADD CONSTRAINT \`FK_80ae64fa3b8b1a6846bfe1d9cec\` FOREIGN KEY (\`tgMessageId\`) REFERENCES \`tbot_dev\`.\`tg_message\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`tbot_dev\`.\`tg_message_tags_tag\` ADD CONSTRAINT \`FK_b9b94544fe88423dbdd512586e9\` FOREIGN KEY (\`tagId\`) REFERENCES \`tbot_dev\`.\`tag\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`tbot_dev\`.\`tg_message_type_message_type\` ADD CONSTRAINT \`FK_2bf7f6d7ec7ab7b129bfce10048\` FOREIGN KEY (\`tgMessageId\`) REFERENCES \`tbot_dev\`.\`tg_message\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`tbot_dev\`.\`tg_message_type_message_type\` ADD CONSTRAINT \`FK_8a1dc8f0d2ca9b3292eb6618f16\` FOREIGN KEY (\`messageTypeId\`) REFERENCES \`tbot_dev\`.\`message_type\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`tbot_dev\`.\`tag_closure\` ADD CONSTRAINT \`FK_32bf6c25aa9e397fe11403b314c\` FOREIGN KEY (\`id_ancestor\`) REFERENCES \`tbot_dev\`.\`tag\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tbot_dev\`.\`tag_closure\` ADD CONSTRAINT \`FK_e59d05669a7d8259abc4b319d8a\` FOREIGN KEY (\`id_descendant\`) REFERENCES \`tbot_dev\`.\`tag\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tbot_dev\`.\`tag_closure\` DROP FOREIGN KEY \`FK_e59d05669a7d8259abc4b319d8a\``);
        await queryRunner.query(`ALTER TABLE \`tbot_dev\`.\`tag_closure\` DROP FOREIGN KEY \`FK_32bf6c25aa9e397fe11403b314c\``);
        await queryRunner.query(`ALTER TABLE \`tbot_dev\`.\`tg_message_type_message_type\` DROP FOREIGN KEY \`FK_8a1dc8f0d2ca9b3292eb6618f16\``);
        await queryRunner.query(`ALTER TABLE \`tbot_dev\`.\`tg_message_type_message_type\` DROP FOREIGN KEY \`FK_2bf7f6d7ec7ab7b129bfce10048\``);
        await queryRunner.query(`ALTER TABLE \`tbot_dev\`.\`tg_message_tags_tag\` DROP FOREIGN KEY \`FK_b9b94544fe88423dbdd512586e9\``);
        await queryRunner.query(`ALTER TABLE \`tbot_dev\`.\`tg_message_tags_tag\` DROP FOREIGN KEY \`FK_80ae64fa3b8b1a6846bfe1d9cec\``);
        await queryRunner.query(`ALTER TABLE \`tbot_dev\`.\`tg_message\` DROP FOREIGN KEY \`FK_e131ff5692667bb5e9b34893955\``);
        await queryRunner.query(`ALTER TABLE \`tbot_dev\`.\`tg_message\` DROP FOREIGN KEY \`FK_30d9b1f1dd6bd2e886a46c018dd\``);
        await queryRunner.query(`ALTER TABLE \`tbot_dev\`.\`tg_message\` DROP FOREIGN KEY \`FK_fdcf0a55eb8301c3bfcb1173a88\``);
        await queryRunner.query(`ALTER TABLE \`tbot_dev\`.\`tg_message\` DROP FOREIGN KEY \`FK_4771752d966a175b8be2442eb63\``);
        await queryRunner.query(`ALTER TABLE \`tbot_dev\`.\`tg_message\` DROP FOREIGN KEY \`FK_e367408401e471571be0afee0a7\``);
        await queryRunner.query(`ALTER TABLE \`tbot_dev\`.\`tg_message\` DROP FOREIGN KEY \`FK_553162a54d2dc32b2dd96b46da9\``);
        await queryRunner.query(`ALTER TABLE \`tbot_dev\`.\`tg_message\` DROP FOREIGN KEY \`FK_acdc1271e7c76f9f00160ede0b5\``);
        await queryRunner.query(`ALTER TABLE \`tbot_dev\`.\`tg_message\` DROP FOREIGN KEY \`FK_b4fb6011e246c0a48800e702542\``);
        await queryRunner.query(`ALTER TABLE \`tbot_dev\`.\`tag\` DROP FOREIGN KEY \`FK_5f4effb7cd258ffa9ef554cfbbb\``);
        await queryRunner.query(`DROP INDEX \`IDX_e59d05669a7d8259abc4b319d8\` ON \`tbot_dev\`.\`tag_closure\``);
        await queryRunner.query(`DROP INDEX \`IDX_32bf6c25aa9e397fe11403b314\` ON \`tbot_dev\`.\`tag_closure\``);
        await queryRunner.query(`DROP TABLE \`tbot_dev\`.\`tag_closure\``);
        await queryRunner.query(`DROP INDEX \`IDX_8a1dc8f0d2ca9b3292eb6618f1\` ON \`tbot_dev\`.\`tg_message_type_message_type\``);
        await queryRunner.query(`DROP INDEX \`IDX_2bf7f6d7ec7ab7b129bfce1004\` ON \`tbot_dev\`.\`tg_message_type_message_type\``);
        await queryRunner.query(`DROP TABLE \`tbot_dev\`.\`tg_message_type_message_type\``);
        await queryRunner.query(`DROP INDEX \`IDX_b9b94544fe88423dbdd512586e\` ON \`tbot_dev\`.\`tg_message_tags_tag\``);
        await queryRunner.query(`DROP INDEX \`IDX_80ae64fa3b8b1a6846bfe1d9ce\` ON \`tbot_dev\`.\`tg_message_tags_tag\``);
        await queryRunner.query(`DROP TABLE \`tbot_dev\`.\`tg_message_tags_tag\``);
        await queryRunner.query(`DROP TABLE \`tbot_dev\`.\`tg_config\``);
        await queryRunner.query(`DROP INDEX \`IDX_e379826ce952332910da6551e6\` ON \`tbot_dev\`.\`tg_chat\``);
        await queryRunner.query(`DROP INDEX \`IDX_6f1d39bfaf0a904434519faad9\` ON \`tbot_dev\`.\`tg_chat\``);
        await queryRunner.query(`DROP TABLE \`tbot_dev\`.\`tg_chat\``);
        await queryRunner.query(`DROP INDEX \`IDX_a0fb118a88c9672247eb882bd8\` ON \`tbot_dev\`.\`tg_message\``);
        await queryRunner.query(`DROP TABLE \`tbot_dev\`.\`tg_message\``);
        await queryRunner.query(`DROP INDEX \`IDX_19d1314dc427bfe79457b2e9a0\` ON \`tbot_dev\`.\`tg_user\``);
        await queryRunner.query(`DROP INDEX \`IDX_1d3970f1a8c4bc96e5a2d208d6\` ON \`tbot_dev\`.\`tg_user\``);
        await queryRunner.query(`DROP INDEX \`IDX_abf9e9b6b169d0c9a5d2918951\` ON \`tbot_dev\`.\`tg_user\``);
        await queryRunner.query(`DROP TABLE \`tbot_dev\`.\`tg_user\``);
        await queryRunner.query(`DROP TABLE \`tbot_dev\`.\`tag\``);
        await queryRunner.query(`DROP TABLE \`tbot_dev\`.\`message_type\``);
    }

}
