Sample Output:

```bash
 ./fetch_commerce_details.sh -p 4pybmzyqfvfu6 -e production -n 3

------------------------------------------------------------------------------------------------------------------------------------

Region          : AMERICAS
Company Name    : Sparta
Cloud Plan      : magento/pro_core12
Project ID      : 4pybmzyqfvfu6
Project URL     : https://console.adobecommerce.com/projects/4pybmzyqfvfu6
Environment     : production
Locale          : America/Santiago
Front URL       : https://sparta.cl/

Admin URI: /equitybr_admin
Commerce Version: Magento CLI 2.4.5-p2
ECE-Tools       :   "version": "2002.1.15",
DB Configuration:
------------------------------------------------------------------------------------------------------------------------------------
Date            : Fri Apr 12 06:05:46 UTC 2024
.magento.env.yaml file:
# RabbitMQ setup
stage:
global:
SKIP_HTML_MINIFICATION: true
build:
SKIP_SCD: false
SCD_STRATEGY: "compact"
QUALITY_PATCHES:
- ACSD-48164
- ACSD-46815
- ACSD-51379-V2
- ACSD-52202
- ACSD-51431
deploy:
REDIS_USE_SLAVE_CONNECTION: true
CRON_CONSUMERS_RUNNER:
cron_run: true
max_messages: 20000
consumers:
- product_action_attribute.update
- product_action_attribute.website.update
- codegeneratorProcessor
- exportProcessor
- quoteItemCleaner
- inventoryQtyCounter
- async.operations.all
------------------------------------------------------------------------------------------------------------------------------------
PHP Config
PHP Version     : 8.1.13
memory_limit  => 2G
realpath_cache_size  => 4096k
opcache.max_accelerated_files  => 60000
opcache.memory_consumption  => 2048MB
php  => |
php  => |
php  => |
CSS merging     :
CSS minification: 1
JS Minification : 1
bundle JS       : 1
------------------------------------------------------------------------------------------------------------------------------------
Redis Config    :
Version         : redis_version:6.2.12
uptime_in_days:189
used_memory_peak_human:2.44G
maxmemory_human:10.00G
maxmemory_policy:volatile-lru
evicted_keys:0
role:master
L2 Cache status :
------------------------------------------------------------------------------------------------------------------------------------
Cache Config : Current status:
config: 1
layout: 1
block_html: 1
collections: 1
reflection: 1
db_ddl: 1
compiled_config: 1
eav: 1
customer_notification: 1
config_integration: 1
config_integration_api: 1
full_page: 1
target_rule: 1
config_webservice: 1
translate: 1
amasty_shopby: 1
wp_ga4_categories: 0
------------------------------------------------------------------------------------------------------------------------------------
Indexer Config  :
+------------------------------------------+-------------------------------------------------------+--------+-----------+---------------------+---------------------+
| ID                                       | Title                                                 | Status | Update On | Schedule Status     | Schedule Updated    |
+------------------------------------------+-------------------------------------------------------+--------+-----------+---------------------+---------------------+
| amasty_amrules_purchase_history_index    | Amasty: Special Promotions - Purchase History Indexer | Ready  | Save      |                     |                     |
| catalog_data_exporter_product_attributes | Catalog Attributes Feed                               | Ready  | Schedule  | idle (0 in backlog) | 2024-04-08 12:38:45 |
| catalogrule_product                      | Catalog Product Rule                                  | Ready  | Schedule  | idle (0 in backlog) | 2024-04-12 05:19:58 |
| catalogrule_rule                         | Catalog Rule Product                                  | Ready  | Schedule  | idle (0 in backlog) | 2024-04-12 05:19:58 |
| catalogsearch_fulltext                   | Catalog Search                                        | Ready  | Schedule  | idle (0 in backlog) | 2024-04-12 05:32:26 |
| catalog_data_exporter_categories         | Category Feed                                         | Ready  | Schedule  | idle (0 in backlog) | 2024-04-11 21:53:08 |
| catalog_category_product                 | Category Products                                     | Ready  | Schedule  | idle (0 in backlog) | 2024-04-12 05:03:52 |
| customer_grid                            | Customer Grid                                         | Ready  | Save      |                     |                     |
| design_config_grid                       | Design Config Grid                                    | Ready  | Schedule  | idle (0 in backlog) | 2024-04-08 19:39:42 |
| inventory                                | Inventory                                             | Ready  | Schedule  | idle (0 in backlog) | 2024-04-12 05:45:08 |
| catalog_product_category                 | Product Categories                                    | Ready  | Schedule  | idle (0 in backlog) | 2024-04-12 05:03:52 |
| catalog_product_attribute                | Product EAV                                           | Ready  | Schedule  | idle (0 in backlog) | 2024-04-11 21:24:06 |
| catalog_data_exporter_products           | Product Feed                                          | Ready  | Schedule  | idle (0 in backlog) | 2024-04-12 05:36:15 |
| catalog_data_exporter_product_overrides  | Product Overrides Feed                                | Ready  | Save      |                     |                     |
| catalog_product_price                    | Product Price                                         | Ready  | Schedule  | idle (0 in backlog) | 2024-04-12 05:31:42 |
| targetrule_product_rule                  | Product/Target Rule                                   | Ready  | Schedule  | idle (0 in backlog) | 2024-04-11 21:53:24 |
| salesrule_rule                           | Sales Rule                                            | Ready  | Schedule  | idle (0 in backlog) | 2024-04-12 06:02:05 |
| cataloginventory_stock                   | Stock                                                 | Ready  | Schedule  | idle (0 in backlog) | 2024-04-12 05:20:22 |
| targetrule_rule_product                  | Target Rule/Product                                   | Ready  | Schedule  | idle (0 in backlog) | 2024-04-08 12:39:43 |
+------------------------------------------+-------------------------------------------------------+--------+-----------+---------------------+---------------------+
------------------------------------------------------------------------------------------------------------------------------------
Search Service  :
Engine          :   "cluster_name" : "opensearch",
Version         :     "number" : "1.2.4",
Heap Size       : heap.current heap.percent heap.max
869.3mb           43    1.9gb
1.2gb           63    1.9gb
1.3gb           70    1.9gb

------------------------------------------------------------------------------------------------------------------------------------
RabbitMQ        : Version: 3.9.11-1~bpo9+1
Consumers List  : product_action_attribute.update
product_action_attribute.website.update
exportProcessor
codegeneratorProcessor
sales.rule.update.coupon.usage
sales.rule.quote.trigger.recollect
staging.synchronize_entity_period
media.storage.catalog.image.resize
matchCustomerSegmentProcessor
product_alert
inventory.source.items.cleanup
inventory.mass.update
inventory.reservations.cleanup
inventory.reservations.update
inventory.reservations.updateSalabilityStatus
inventory.indexer.sourceItem
inventory.indexer.stock
media.content.synchronization
media.gallery.renditions.update
media.gallery.synchronization
placeOrderProcessor
quoteItemCleaner
inventoryQtyCounter
async.operations.all
------------------------------------------------------------------------------------------------------------------------------------
Processes (Top Memory Usage):
PID  PPID CMD                         %MEM %CPU
4642     1 /usr/sbin/mysqld --wsrep_st 27.9 66.4
24650     1 /opt/temurin/11/bin/java -X  1.5 10.1
26749 26737 /usr/bin/redis-server 0.0.0  0.7  1.2
47706 46771 php bin/magento cron:run --  0.2 67.6
19494 26745 /usr/bin/nuntiusd-pe -confi  0.2  1.5
1177     1 /usr/lib/erlang/erts-12.3.1  0.1  1.7
1169     1 /usr/bin/java -cp /etc/zook  0.1  0.3
18571     1 /usr/sbin/glusterfsd -s 192  0.1  1.5
47928 42820 php-fpm: pool 4pybmzyqfvfu6  0.1 38.1
------------------------------------------------------------------------------------------------------------------------------------
SCD Config st: The configured state is ideal
Deploy versio: 1712174568
------------------------------------------------------------------------------------------------------------------------------------

Last Deployment :
[2024-04-03T20:09:25.776379+00:00] NOTICE: End of validation
[2024-04-03T20:09:25.776751+00:00] INFO: Checking existence of encryption key
[2024-04-03T20:09:25.777940+00:00] INFO: Checking if db exists and has tables
[2024-04-03T20:09:25.781237+00:00] INFO: Magento was installed on Wed, 15 Jan 2020 19:50:09 +0000
[2024-04-03T20:09:25.782808+00:00] NOTICE: Starting update.
[2024-04-03T20:09:25.783048+00:00] INFO: Updating env.php.
[2024-04-03T20:09:25.793814+00:00] INFO: Updating env.php cron consumers runner configuration.
[2024-04-03T20:09:25.803350+00:00] INFO: Updating env.php DB connection configuration.
[2024-04-03T20:09:25.812027+00:00] INFO: Updating env.php AMQP configuration.
[2024-04-03T20:09:25.820936+00:00] INFO: redis will be used for session if it was not override by SESSION_CONFIGURATION
[2024-04-03T20:09:25.821112+00:00] INFO: Updating session configuration.
[2024-04-03T20:09:25.828555+00:00] INFO: Updating search engine configuration.
[2024-04-03T20:09:25.828682+00:00] INFO: Set search engine to: elasticsearch7
[2024-04-03T20:09:25.836290+00:00] INFO: Skipping URL updates because we are deploying to a Production or Staging environment. You can override this behavior by setting the FORCE_URL_UPDATES variable to true.
[2024-04-03T20:09:25.836429+00:00] INFO: The value of the property 'directories/document_root_is_pub' set as 'true'
[2024-04-03T20:09:25.871927+00:00] INFO: The lock provider "file" was set.
[2024-04-03T20:09:25.882548+00:00] INFO: Updating env.php backend front name.
[2024-04-03T20:09:25.892175+00:00] INFO: Flushing cache.
[2024-04-03T20:09:27.002858+00:00] INFO: Cache flushed successfully.
[2024-04-03T20:09:27.023157+00:00] INFO: Running setup upgrade.
[2024-04-03T20:10:00.912013+00:00] NOTICE: End of update.
[2024-04-03T20:10:00.913462+00:00] INFO: Static content deployment was performed during the build phase or disabled. Skipping deploy phase static content compression.
[2024-04-03T20:10:00.913795+00:00] INFO: Post-deploy hook enabled. Cron enabling, cache flushing and pre-warming operations are postponed to post-deploy stage.
[2024-04-03T20:10:02.998821+00:00] NOTICE: Maintenance mode is disabled.
[2024-04-03T20:10:02.999075+00:00] INFO: Scenario(s) finished

------------------------------------------------------------------------------------------------------------------------------------
Maintenance     : Status: maintenance mode is not active
List of exempt IP-addresses: 181.46.9.114 207.248.216.6
------------------------------------------------------------------------------------------------------------------------------------
Recent Cloud Activities List in the production Environment for 4pybmzyqfvfu6:
Activities on the project Sparta (4pybmzyqfvfu6), environment production:

More activities may be available.
To display older activities, increase --limit above 5, or set --start to a date in the past.
Exclude the most frequent activity type by adding: -x push

To view the log for an activity, run: magento-cloud activity:log [id]
To view more information about an activity, run: magento-cloud activity:get [id]

For more information, run: magento-cloud activity:list -h
+---------------+---------------------------+--------------------------------------------+----------+----------+---------+
| ID            | Created                   | Description                                | Progress | State    | Result  |
+---------------+---------------------------+--------------------------------------------+----------+----------+---------+
| jzyhzpuhoavpi | 2024-04-03T19:57:11+00:00 | Bitbucket integration pushed to Production | 100%     | complete | success |
| mn6uscn5ecnuk | 2024-02-29T12:45:52+00:00 | Bitbucket integration pushed to Production | 100%     | complete | success |
| swx7qadvs5y7c | 2024-02-28T15:52:23+00:00 | Bitbucket integration pushed to Production | 100%     | complete | success |
| 4aazzfw5idjde | 2024-01-12T12:26:23+00:00 | Bitbucket integration pushed to Production | 100%     | complete | success |
| p3c4wd24jsfs2 | 2024-01-08T14:50:35+00:00 | Bitbucket integration pushed to Production | 100%     | complete | success |
+---------------+---------------------------+--------------------------------------------+----------+----------+---------+

------------------------------------------------------------------------------------------------------------------------------------

MySQL
+-----------------+
| MariaDB Version |
+-----------------+
| 10.4.25         |
+-----------------+
+----------------------+
|                      |
+----------------------+
| List MySQL Processes |
+----------------------+
+-----------+---------------+-------------------+---------------+---------+------+---------------------------------+------------------------------------------------------------------------------------------------------+----------+
| Id        | User          | Host              | db            | Command | Time | State                           | Info                                                                                                 | Progress |
+-----------+---------------+-------------------+---------------+---------+------+---------------------------------+------------------------------------------------------------------------------------------------------+----------+
| 178878210 | 4pybmzyqfvfu6 | 192.168.0.6:37770 | 4pybmzyqfvfu6 | Sleep   |  294 |                                 | NULL                                                                                                 |    0.000 |
| 178878216 | 4pybmzyqfvfu6 | 192.168.0.6:37806 | 4pybmzyqfvfu6 | Sleep   |    0 |                                 | NULL                                                                                                 |    0.000 |
| 178879705 | 4pybmzyqfvfu6 | 192.168.0.5:55094 | 4pybmzyqfvfu6 | Sleep   |   59 |                                 | NULL                                                                                                 |    0.000 |
| 178879708 | 4pybmzyqfvfu6 | 192.168.0.5:55126 | 4pybmzyqfvfu6 | Sleep   |    0 |                                 | NULL                                                                                                 |    0.000 |
| 178880159 | 4pybmzyqfvfu6 | 192.168.0.7:55552 | 4pybmzyqfvfu6 | Sleep   |    0 |                                 | NULL                                                                                                 |    0.000 |
| 178880163 | 4pybmzyqfvfu6 | 192.168.0.5:37824 | 4pybmzyqfvfu6 | Sleep   |    0 |                                 | NULL                                                                                                 |    0.000 |
| 178880165 | 4pybmzyqfvfu6 | 192.168.0.7:55582 | 4pybmzyqfvfu6 | Sleep   |    0 |                                 | NULL                                                                                                 |    0.000 |
| 178880166 | 4pybmzyqfvfu6 | 192.168.0.5:37834 | 4pybmzyqfvfu6 | Sleep   |    0 |                                 | NULL                                                                                                 |    0.000 |
| 178880167 | 4pybmzyqfvfu6 | 192.168.0.5:37842 | 4pybmzyqfvfu6 | Query   |    0 | Sending data                    | SELECT `main_table`.*, `yotpo_sync`.`sync_flag` AS `yotpo_sync_flag` FROM `sales_order` AS `main_tab |    0.000 |
| 178880169 | 4pybmzyqfvfu6 | 192.168.0.7:55592 | 4pybmzyqfvfu6 | Sleep   |    0 |                                 | NULL                                                                                                 |    0.000 |
| 178880170 | 4pybmzyqfvfu6 | 192.168.0.5:37864 | 4pybmzyqfvfu6 | Query   |    0 | Sending cached result to client | SELECT `catalog_eav_attribute`.* FROM `catalog_eav_attribute` WHERE (attribute_id = '412')           |    0.000 |
| 178880171 | 4pybmzyqfvfu6 | 192.168.0.5:37866 | 4pybmzyqfvfu6 | Sleep   |    0 |                                 | NULL                                                                                                 |    0.000 |
| 178880172 | 4pybmzyqfvfu6 | 192.168.0.6:49038 | 4pybmzyqfvfu6 | Sleep   |    0 |                                 | NULL                                                                                                 |    0.000 |
| 178880174 | 4pybmzyqfvfu6 | 192.168.0.7:55608 | 4pybmzyqfvfu6 | Sleep   |    0 |                                 | NULL                                                                                                 |    0.000 |
| 178880175 | 4pybmzyqfvfu6 | 192.168.0.5:37868 | 4pybmzyqfvfu6 | Query   |    0 | Init                            | show processlist                                                                                     |    0.000 |
+-----------+---------------+-------------------+---------------+---------+------+---------------------------------+------------------------------------------------------------------------------------------------------+----------+
+---------------------------------+
|                                 |
+---------------------------------+
| Count cron jobs by their status |
+---------------------------------+
+---------+----------+
| status  | count(*) |
+---------+----------+
| error   |       98 |
| missed  |      404 |
| pending |     2214 |
| running |        3 |
| success |    24426 |
+---------+----------+
+-----------------------------------------------+
|                                               |
+-----------------------------------------------+
| List the first 10 cron jobs with error status |
+-----------------------------------------------+
+-------------+--------------------+--------+----------+---------------------+--------------+---------------------+-------------+
| schedule_id | job_code           | status | messages | created_at          | scheduled_at | executed_at         | finished_at |
+-------------+--------------------+--------+----------+---------------------+--------------+---------------------+-------------+
|    85072594 | sales_clean_quotes | error  | NULL     | 2022-02-10 14:08:57 | NULL         | 2022-02-10 14:08:57 | NULL        |
|    85073785 | sales_clean_quotes | error  | NULL     | 2022-02-10 14:18:51 | NULL         | 2022-02-10 14:18:51 | NULL        |
|    85082944 | sales_clean_quotes | error  | NULL     | 2022-02-10 16:05:51 | NULL         | 2022-02-10 16:05:51 | NULL        |
|    85088395 | sales_clean_quotes | error  | NULL     | 2022-02-10 17:13:14 | NULL         | 2022-02-10 17:13:14 | NULL        |
|    85090546 | sales_clean_quotes | error  | NULL     | 2022-02-10 17:31:10 | NULL         | 2022-02-10 17:31:10 | NULL        |
|    85100134 | sales_clean_quotes | error  | NULL     | 2022-02-10 19:28:59 | NULL         | 2022-02-10 19:28:59 | NULL        |
|    85117072 | sales_clean_quotes | error  | NULL     | 2022-02-10 22:42:37 | NULL         | 2022-02-10 22:42:37 | NULL        |
|    85132633 | sales_clean_quotes | error  | NULL     | 2022-02-11 01:37:48 | NULL         | 2022-02-11 01:37:48 | NULL        |
|    85177486 | sales_clean_quotes | error  | NULL     | 2022-02-11 10:14:00 | NULL         | 2022-02-11 10:14:00 | NULL        |
|    85181860 | sales_clean_quotes | error  | NULL     | 2022-02-11 11:12:32 | NULL         | 2022-02-11 11:12:32 | NULL        |
+-------------+--------------------+--------+----------+---------------------+--------------+---------------------+-------------+
Connection to ssh.us-5.magento.cloud closed.

------------------------------------------------------------------------------------------------------------------------------------

Node 1 Disk usage - Hostname : i-087e91f5fe49e5ca9
Disk Usage on /dev/shm:
tmpfs                                          93G   36K   93G   1% /dev/shm
Disk Usage on /data:
/dev/nvme3n1                                   52G   38G   14G  74% /data/mysql
/dev/nvme2n1                                  138G  113G   25G  82% /data/exports
tmpfs                                          93G  4.0K   93G   1% /data/exports/shared

------------------------------------------------------------------------------------------------------------------------------------

Node 2 Disk usage - Hostname : i-0f6c4bfb8216e0039
Disk Usage on /dev/shm:
tmpfs                                          94G   36K   94G   1% /dev/shm
Disk Usage on /data:
/dev/nvme2n1                                   52G   35G   17G  68% /data/mysql
/dev/nvme1n1                                  138G  115G   23G  84% /data/exports
tmpfs                                          94G  4.0K   94G   1% /data/exports/shared

------------------------------------------------------------------------------------------------------------------------------------

Node 3 Disk usage - Hostname : i-0327a757b98379192
Disk Usage on /dev/shm:
tmpfs                                          93G   36K   93G   1% /dev/shm
Disk Usage on /data:
/dev/nvme1n1                                  138G  115G   23G  84% /data/exports
/dev/nvme2n1                                   52G   35G   17G  68% /data/mysql
tmpfs                                          93G  4.0K   93G   1% /data/exports/shared

------------------------------------------------------------------------------------------------------------------------------------

Do you want to clone the environment repository? (yes/no): no
Skipping cloning the environment.
/Users/abalachandra/git/mad/fetch_commerce_details.sh: line 334: the: command not found
Time Elapsed: 89 seconds
