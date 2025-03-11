import React from 'react';
import { Tabs, TabsItem, platformUrlState, PlatformStateContext,NerdletStateContext,NerdletState,  NerdGraphQuery, Spinner, HeadingText, Grid, GridItem, Stack, StackItem, Select, SelectItem, AreaChart, TableChart, PieChart, LineChart, BillboardChart, BarChart,ColumnChart } from 'nr1'
import { timeRangeToNrql } from '@newrelic/nr1-community';
import { nerdlet } from 'nr1';
import {AccountPicker} from 'nr1';
//import {navigation} from 'nr1';
import Chart from "react-google-charts";
export  {Chart};
//import  {CircleMarker, Map, TileLayer} from 'react-leaflet';
import { Link } from 'nr1';
import { UserQuery } from 'nr1'

export  default class Example extends React.Component {
    constructor() {
        console.log('entered constructor...')
        super(...arguments);
        this.state = { accountId: nerdlet.accountId, sessiondata: this.session };
        this.session = ['eventType', 'accountId','date','account_name','user_id','user_name','user_email' ]
        console.log('this state at beginning: ', this.state)
        this.onChangeAccount = this.onChangeAccount.bind(this);

    }
    onChangeAccount(event,value) {
        console.log('entered onChangeAccount function...')

        //this.setState({ accountId: value, selectedAccount: value });
        this.setState({ selectedAccount: value,accountId: value });
        this.fireSessionLog(JSON.stringify(this.sessiondata))
        nerdlet.setUrlState({accountId: value, selectedAccount: value})
        console.log('Setting nerdlet accountId value: ', nerdlet.accountId)
        console.log('SessionDataOnChange ->', this.state.sessiondata)

        //console.log('prefire->>>>>')

    }

    componentDidMount() {
        console.log('didmount updated');

        this.fireSessionLog(JSON.stringify(this.sessiondata))
    }

    openEntity() {
        console.log('entered openEntity function...')

        // const { entityGuid, appName, accountId } = this.state;
        /*nerdlet.setUrlState({ entityGuid, appName, accountId:this.nerdlet.accountId   });*/
        /*navigation.openEntity(nerdlet);*/
    }


    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        console.log('didupdate updated')
    }

    fireSessionLog(sessiondata){


        (async () => {

            console.log('what it looks like',this.sessiondata)

            const rawResponse = await fetch('https://insights-collector.newrelic.com/v1/accounts/' + 2589226 + '/events', {
                method: 'POST',
                headers: {'X-Insert-Key': 'NRII-T5UoH65m6vGeX2WMfYUjVaYxWN1Rj41_','Accept': 'application/json','Accept-Encoding': 'gzip, deflate, br'},

                body: JSON.stringify(this.sessiondata)
            });
            const content = await rawResponse.json();
            console.log('rawResponse ->',JSON.stringify(content));})();
        console.log('post event ', this.sessiondata)



    }








    render() {


        console.log('entering render....')
        var { accountId , accounts, selectedAccount,  count , sessiondata  } = this.state;
        //const d = new Date();
        const d = parseInt((new Date().getTime() / 1000).toFixed(0));
        const data=[];



        this.state.date=d;
        //console.log('TimeStamp: ', d)
        this.state.count = 0
        UserQuery.query().then(({ data }) => {  let userdatat = JSON.stringify(data);

            return(userdatat)
        });

        const gql = `query($id: Int!) {
        actor {
          account(id: $id) {
            id
            name
          }
          user {
            name
            id
            email
          }
        }
      }`;
        const variables={"id": this.state.accountId } // one of the hardest things to figure how to do, pass in the accountId, this line and the next

        const record =  NerdGraphQuery.query({variables, query: gql}) //The NerdGraphQuery.query method called with the query object to get your account data is stored in the accounts variable.
        record.then(results => {

            this.state.session = results;
            console.log('SessionData --> ',JSON.stringify(this.state.session));
            //const sessionObject = JSON.parse(this.state.session)
            console.log('Session User Object ->', this.state.session.data.actor.user)
            console.log('Session Account Object ->', this.state.session.data.actor.account)
            console.log('Session Date ->', this.state.date)
            this.sessiondata = {"eventType":"MageStateSession","accountId": 2589226,"date": this.state.date, 'site_id':this.state.session.data.actor.account.id,'site_name': this.state.session.data.actor.account.name,'user_id':this.state.session.data.actor.user.id,'user_name':this.state.session.data.actor.user.name,'user_email':this.state.session.data.actor.user.email,'app_type':"OAAC"}
            //console.log('test session ->',JSON.stringify(sessiondata));f
            console.log('test session -> ',this.sessiondata)
            this.fireSessionLog(JSON.stringify(this.sessiondata))
            return this.sessiondata;

        }).catch((error) => { console.log('Nerdgraph Error:', error); })
        //const session_json = {"eventType:":"MageStateSession", "accountId":this.state.accountId,"date":this.state.date,"account_name":this.state.session.data.actor.account.name,"user_id":this.state.session.data.actor.user.id,"user_name":this.state.session.data.actor.user.name,"user_email":this.state.session.data.actor.user.email }
        console.log('find it --->',sessiondata)


        const alertTimeLine = `SELECT filter(count(conditionName), WHERE priority like'%critical%') as 'critical alert',filter(count(conditionName), WHERE priority like'%warning%') as 'warning alert' from NrAiIncident facet conditionName,event timeseries `
        const avgResTime = `SELECT average(duration) FROM Transaction FACET appName TIMESERIES AUTO   `;
        const trxOverview = `FROM Transaction SELECT count(*) as 'Transactions', apdex(duration) as 'apdex', percentile(duration, 99, 95) FACET appName  `;
        const errCount = `FROM TransactionError SELECT count(*) as 'Transaction Errors' FACET error.message TIMESERIES AUTO  `;
        const responseCodes = `SELECT count(*) as 'Response Code' FROM Transaction FACET httpResponseCode  TIMESERIES AUTO  `;
        const nginxStatus = `FROM Log SELECT count (message) as 'access count' where (ident ='access.log' OR filePath like '%access.log%') facet hostname TIMESERIES `;
        //const datastoreOpsCron = `SELECT average('apm.service.datastore.operation.duration') FROM Metric WHERE appName LIKE '%' AND (metricTimesliceName = 'Datastore/statement/MySQL/cron_schedule/update') OR (metricTimesliceName = 'Datastore/statement/MySQL/cron_schedule/delete') OR (metricTimesliceName = 'Datastore/statement/MySQL/cron_schedule/insert') OR (metricTimesliceName = 'Datastore/statement/MySQL/cron_schedule/select') facet metricTimesliceName  TIMESERIES `
        const datastoreOpsCron = `SELECT max(apm.service.datastore.operation.duration) FROM Metric FACET metricTimesliceName WHERE appName LIKE '%' AND metricTimesliceName like 'Datastore/statement/MySQL/cron_schedule/%'  TIMESERIES `
        const datastoreOpsTable = `SELECT max(apm.service.datastore.operation.duration) FROM Metric FACET table,metricTimesliceName WHERE appName LIKE '%'  TIMESERIES limit 10  `
        //const datastoreOpsCronLock = `FROM Log SELECT filter(count(message), WHERE message like '%SQLSTATE[HY000]:  wait timeout exceeded; try restarting transaction, query was: UPDATE \`cron_schedule\`%') as 'cron_sched_update_lock',filter(count(message), WHERE message like '%SQLSTATE[HY000]: General error: 1205 Lock wait timeout exceeded; try restarting transaction, query was: DELETE \`cron_schedule\`%') as 'cron_sched_delete_lock',filter(count(message), WHERE message like '%SQLSTATE[HY000]: General error: 1205 Lock wait timeout exceeded; try restarting transaction, query was: COMMIT \`cron_schedule\`%') as 'cron_sched_commit_lock',filter(count(message), WHERE message like '%SQLSTATE[HY000]: General error: 1205 Lock wait timeout exceeded; try restarting transaction, query was: INSERT \`cron_schedule\`%') as 'cron_sched_insert_lock'  TIMESERIES `
        const datastoreOpsCronLock = `FROM Log SELECT filter(count(message), WHERE message like '%1205 Lock wait timeout exceeded; try restarting transaction, query was: UPDATE \`cron_schedule\` %') as 'cron_sched_update_lock',filter(count(message), WHERE message like '%1205 Lock wait timeout exceeded; try restarting transaction, query was: DELETE \`cron_schedule\` %') as 'cron_sched_delete_lock',filter(count(message), WHERE message like '%1205 Lock wait timeout exceeded; try restarting transaction, query was: COMMIT \`cron_schedule\` %') as 'cron_sched_commit_lock',filter(count(message), WHERE message like '%1205 Lock wait timeout exceeded; try restarting transaction, query was: INSERT \`cron_schedule\` %') as 'cron_sched_insert_lock'  TIMESERIES  `
        /*const redisLog = `FROM Log SELECT  filter(count(message), WHERE message like '%Connection with master lost.%') as 'pri_lost', filter(count(message), WHERE message like '%ASAP for overcoming of output buffer limits%') as 'out_buf' facet hostname timeseries AUTO `;*/
        const phpLog = `FROM Log SELECT filter(count(message), WHERE message like '%NOTICE: Terminating ...%') as 'php_term',  filter(count(message), WHERE message like '% NOTICE: exiting, bye-bye!%') as 'php_exit',  filter(count(message), WHERE message like '% NOTICE: fpm is running, pid%') as 'fpm_start',  filter(count(message), WHERE message like '%NOTICE: ready to handle connections%') as 'php_ready' FACET hostname timeseries auto  `
        const galeraLogHost = `FROM Log SELECT filter(count(message), WHERE message like '%1047 WSREP has not yet prepared node for application use%') as 'node_not_prep_for_use',  filter(count(message), WHERE message like '%[ERROR] WSREP: Failed to read from: wsrep_sst_xtrabackup-v2%') as 'xtrabackup_read_fail',filter(count(message), WHERE message like '%[ERROR] WSREP: Process completed with error: wsrep_sst_xtrabackup-v2 %') as 'xtrabackup_compl_w_err',filter(count(message), WHERE message like '%[ERROR] WSREP: rbr write fail%') as 'rbr_write_fail',filter(count(message), WHERE message like '%self-leave%') as 'susp_node',  filter(count(message), WHERE message like '%members    = 3/3 (joined/total)%') as '3of3',  filter(count(message), WHERE message like '%members    = 2/3 (joined/total)%') as '2of3',  filter(count(message), WHERE message like '%members    = 2/2%') as '2of2',  filter(count(message), WHERE message like '%members    = 1/2%') as '1of2', filter(count(message), WHERE message like '%members    = 1/3%') as '1of3',  filter(count(message), WHERE message like '%members    = 1/1%') as '1of1',  filter(count(message), WHERE message like '%[Note] /usr/sbin/mysqld (mysqld 10.%') as 'sql_restart',  filter(count(message), WHERE message like '%Quorum: No node with complete state:%') as 'no_node_count',  filter(count(message), WHERE message like '%WSREP: Member 0%') as 'mem_0',  filter(count(message), WHERE message like '%WSREP: Member 1.0%') as 'mem_1',  filter(count(message), WHERE message like '%WSREP: Member 2%') as 'mem2', filter(count(message), WHERE message like '%WSREP: Synchronized with group, ready for connections%') as 'ready',filter(count(message), WHERE message like '%/usr/sbin/mysqld, Version:%') as 'mysql_restart_mysql.slow',filter(count(message), WHERE message like '%[Note] WSREP: New cluster view: global state:%') as 'galera_cluster_view_chng' facet hostname TIMESERIES `;
        const galeraLog = `FROM Log SELECT filter(count(message), WHERE message like '%1047 WSREP has not yet prepared node for application use%') as 'node_not_prep_for_use',  filter(count(message), WHERE message like '%[ERROR] WSREP: Failed to read from: wsrep_sst_xtrabackup-v2%') as 'xtrabackup_read_fail',filter(count(message), WHERE message like '%[ERROR] WSREP: Process completed with error: wsrep_sst_xtrabackup-v2 %') as 'xtrabackup_compl_w_err',filter(count(message), WHERE message like '%[ERROR] WSREP: rbr write fail%') as 'rbr_write_fail',filter(count(message), WHERE message like '%self-leave%') as 'susp_node',  filter(count(message), WHERE message like '%members    = 3/3 (joined/total)%') as '3of3',  filter(count(message), WHERE message like '%members    = 2/3 (joined/total)%') as '2of3',  filter(count(message), WHERE message like '%members    = 2/2%') as '2of2',  filter(count(message), WHERE message like '%members    = 1/2%') as '1of2', filter(count(message), WHERE message like '%members    = 1/3%') as '1of3',  filter(count(message), WHERE message like '%members    = 1/1%') as '1of1',  filter(count(message), WHERE message like '%[Note] /usr/sbin/mysqld (mysqld 10.%') as 'sql_restart',  filter(count(message), WHERE message like '%Quorum: No node with complete state:%') as 'no_node_count',  filter(count(message), WHERE message like '%WSREP: Member 0%') as 'mem_0',  filter(count(message), WHERE message like '%WSREP: Member 1.0%') as 'mem_1',  filter(count(message), WHERE message like '%WSREP: Member 2%') as 'mem2', filter(count(message), WHERE message like '%WSREP: Synchronized with group, ready for connections%') as 'ready',filter(count(message), WHERE message like '%/usr/sbin/mysqld, Version:%') as 'mysql_restart_mysql.slow',filter(count(message), WHERE message like '%[Note] WSREP: New cluster view: global state:%') as 'galera_cluster_view_chng' TIMESERIES   `;
        const galeraNumNodes = `FROM Log SELECT filter(count(message), WHERE message like '% number of nodes: 1%') as '1 node',filter(count(message), WHERE message like '%memb_num = 1%') as '1 node',filter(count(message), WHERE message like '% number of nodes: 2%') as '2 nodes',filter(count(message), WHERE message like '%memb_num = 2%') as '2 nodes',filter(count(message), WHERE message like '% number of nodes: 3%') as '3 nodes',filter(count(message), WHERE message like '%memb_num = 3%') as '3 nodes',filter(count(message), WHERE message like '%Received NON-PRIMARY%') as 'non_primary', filter(count(message), WHERE message like '% Primary, number of nodes: 3%') as primary_3, filter(count(message), WHERE message like '% Primary, number of nodes: 2%') as primary_2,filter(count(message), WHERE message like '% Primary, number of nodes: 1%') as primary_1 TIMESERIES `
        const galeraNodeShut = `FROM Log SELECT filter(count(message), WHERE message like '%/usr/sbin/mysqld: Shutdown%') as 'mysql_shutdown',filter(count(message), WHERE message like '%[Warning] WSREP: access file(/data/mysql//gvwstate.dat) failed%') as 'state_recov_failed',filter(count(message), WHERE message like '%WSREP: Start replication%') as 'replication_start',filter(count(message), WHERE message like '%WSREP: save pc into disk%') as 'save_pc_disk',filter(count(message), WHERE message like '%wsrep_sst_mariabackup%') as 'sst_mariadb_backup',filter(count(message), WHERE message like '%WSREP: SST complete%') as 'sst_complete',filter(count(message), WHERE message like '%/usr/sbin/mysqld: ready for connections.%') as 'ready', filter(count(message), WHERE message like '%WSREP: Receiving IST...100.0%%') as ist_received, filter(count(message), WHERE message like '%WSREP: Synchronized with group, ready for connections%') as synched_ready facet hostname TIMESERIES  `
        /*const redisLog = `FROM Log SELECT filter(count(message), WHERE message like '%Server started, Redis version%') as 'serv_start',  filter(count(message), WHERE message like '%ready to accept connections%') as 'ready',  filter(count(message), WHERE message like '%Connection with master lost.%') as 'pri_lost',  filter(count(message), WHERE message like '%Starting BGSAVE for SYNC with target: disk%') as 'bg_save', filter(count(message), WHERE message like '%DB saved on disk%') as 'db_saved',  filter(count(message), WHERE message like '%of memory used by copy-on-write%') as 'mem_used',  filter(count(message), WHERE message like '%Background saving terminated with success%') as 'save_succ',  filter(count(message), WHERE message like '%Full resync from master:%') as 'full_sync',  filter(count(message), WHERE message like '%Received SIGTERM scheduling shutdown%') as 'sig_term',  filter(count(message), WHERE message like '%Sentinel is now ready to exit, bye bye%') as 'sent_bye',  filter(count(message), WHERE message like '%DB loaded from disk:%') as 'db_load' facet hostname TIMESERIES `;*/
        const dbprocs = `SELECT average(cpuPercent) FROM ProcessSample TIMESERIES FACET processDisplayName,apmApplicationNames,hostname WHERE processDisplayName like '%mariadb%' or processDisplayName like '%mysql%' or processDisplayName like 'mb%' `
        const redisCommands = `SELECT average(net.commandsProcessedPerSecond) as 'Commands' FROM RedisSample TIMESERIES  FACET apmApplicationNames,entityName  `
        const redisLog = `FROM Log SELECT  filter(count(message), WHERE message like '%SLAVE synchronization: No space left on device%') as 'space' ,  filter(count(message), WHERE message like '%Server started, Redis version%') as 'serv_start' ,  filter(count(message), WHERE message like '%The server is now ready to accept connections%') as 'ready',  filter(count(message), WHERE message like '%Connection with master lost.%') as 'mstr_lost'  ,  filter(count(message), WHERE message like '%+sdown sentinel%') as '+sentinal'  ,  filter(count(message), WHERE message like '%-sdown sentinel%') as '-sentinal' ,  filter(count(message), WHERE message like '%-sdown slave%') as '-slave',  filter(count(message), WHERE message like '%+sdown slave%') as '+slave',  filter(count(message), WHERE message like '%-failover-abort-not-elected master mymaster%') as '-failover',  filter(count(message), WHERE message like '%+failover-abort-not-elected master mymaster%') as '+failover',  filter(count(message), WHERE message like '%Partial resynchronization not possible (no cached master)%') as 'part_sync_err',  filter(count(message), WHERE message like '%MASTER aborted replication with an error: ERR Can%') as 'mstr_sync_err',  filter(count(message), WHERE message like '%Master does not wiki PSYNC or is in error state%') as 'mstr_psync_err',  filter(count(message), WHERE message like '%SLAVE sync: Finished with success%') as ' slv_sync_suc',  filter(count(message), WHERE message like '%MASTER aborted replication with an error: ERR Can%') as 'mstr_sync_err,coun',  filter(count(message), WHERE message like '%OOM command not allowed when used memory%') as ' max_mem_err',  filter(count(message), WHERE message like '%CredisException(code: 0): read error on connection%') as 'credis_read_error',  filter(count(message), WHERE message like '%Uncaught RedisException:%') as 'redis_excp_err' ,  filter(count(message), WHERE message like '%psync scheduled to be closed ASAP for overcoming of output buffer%') as 'output_buf_err'  TIMESERIES  `
        const redisNode = `SELECT  apmApplicationNames,entityName,cluster.role,software.version,instanceType FROM RedisSample  `
        const trafvWeek = `FROM Log SELECT count(*) AS 'traffic' WHERE 'client_ip' IS NOT NULL  COMPARE WITH 1 week ago TIMESERIES  `
        const ipFreq = `FROM Log SELECT count ('client_ip')  WHERE 'client_ip' IS NOT NULL and cache_status in ('PASS','MISS')  FACET client_ip  LIMIT 20 TIMESERIES    `
        const ipFreqAccess = ``
        const ipRate = `FROM Log SELECT rate(count('client_ip'), 1 minute) WHERE 'client_ip' IS NOT NULL and cache_status in ('PASS','MISS')  facet client_ip timeseries limit 20 `
        const ipResponse = `SELECT max(numeric(time_elapsed)) / 1000000 FROM Log  TIMESERIES  AUTO limit 20 facet url `
        const ipRatePageView = `FROM Log,PageView SELECT rate(count('client_ip'), 1 minute), count('client_ip'), count(PageView.name) facet name timeseries `
        const page404 = `FROM Transaction SELECT count(*)  WHERE httpResponseCode = 404  FACET name `
        const fastlyCache = `FROM Log SELECT percentage(count(cache_status) , WHERE cache_status ='HIT') as 'HIT', percentage(count(cache_status) , WHERE cache_status ='MISS') as 'MISS', percentage(count(cache_status) , WHERE cache_status ='ERROR') as 'ERROR', percentage(count(cache_status) , WHERE cache_status ='PASS') as 'PASS',percentage(count(cache_status) , WHERE cache_status ='HITPASS') as 'HITPASS', percentage(count(cache_status) , WHERE cache_status ='HIT-STALE') as 'HITSTALE', percentage(count(cache_status) , WHERE cache_status ='HIT-SYNTH') as 'HITSYNTH', percentage(count(cache_status) , WHERE cache_status ='BG-ERROR') as 'BGERROR', percentage(count(cache_status) , WHERE cache_status ='ERROR-LOSTHDR') as 'ERRORLOSTHDR', percentage(count(cache_status) , WHERE cache_status ='%-CLUSTER%') as 'CLUSTER', percentage(count(cache_status) , WHERE cache_status ='%-REFRESH%') as 'REFRESH' , percentage(count(cache_status) , WHERE cache_status ='%-WAIT%') as 'WAIT' TIMESERIES limit max `
        const fastlyCacheTime = `SELECT average(numeric(time_elapsed))/ 1000000 FROM Log   where cache_status is not NULL and is_cacheable like 'true' TIMESERIES facet cache_status limit max `
        const fastlyCacheTimePOP = `SELECT average(numeric(time_elapsed))/ 1000000 FROM Log   where cache_status is not NULL and is_cacheable like 'true' TIMESERIES facet cache_status,geo_datacenter limit max `
        const cdnyAvgTimeElapsed = `SELECT average(numeric(time_elapsed)), max(numeric(time_elapsed)) from Log where cache_status is not null facet cache_status timeseries `
        const pageRend = `FROM PageView SELECT count(pageUrl), average(pageRenderingDuration)   COMPARE WITH 1 WEEK AGO TIMESERIES  `
        const transAvgMaxMin = `FROM Transaction SELECT average(duration), max(duration), min(duration)  FACET name  `
        const AdminAct = `SELECT adminName , duration, name, error FROM Transaction WHERE adminUser IS NOT NULL AND adminUser != 'N/A' LIMIT 50  `
        const deployLog = `SELECT count(*) from Log WHERE 'ident' IS NOT NULL AND ident = 'deploy.log' OR ident ='post_deploy.log' OR ident ='cloud.log'OR filePath like '%deploy.log%' OR filePath like '%post_deploy.log%' OR filePath like '%cloud.log%' TIMESERIES facet filePath,ident `
        const deployState = `SELECT filter(count(message), WHERE message like '%NOTICE: Starting generate command%') as 'start_gen',filter(count(message), WHERE message like '%git apply /app/vendor/cmdb/ece-tools/patches%') as 'apply_patches' ,  filter(count(message), WHERE message like '%Set flag: .static_content_deploy%') as 'SCD',  filter(count(message), WHERE message like '%NOTICE: Generate command completed%') as 'gen_compl'  ,  filter(count(message), WHERE message like '%NOTICE: Starting deploy.%') as 'start_deploy'  ,  filter(count(message), WHERE message like '%NOTICE: Deployment completed%') as 'deploy_compl' ,  filter(count(message), WHERE message like '%NOTICE: Starting post-deploy.%') as 'start_pdeploy',  filter(count(message), WHERE message like '%NOTICE: Post-deploy is complete%') as 'pdeploy',  filter(count(message), WHERE message like '%deploy-complete%') as 'cl_deploy_compl' FROM Log  WHERE ident='deploy.log' OR ident='cloud.log' OR filePath like '%deploy.log%' or filePath like '%cloud.log%' TIMESERIES `
        const deployLogDetail = `SELECT filter(count(message), WHERE message like'%NOTICE: Starting deploy.%') as 'start_dply',filter(count(message), WHERE message like '%INFO: Starting scenario(s): scenario/deploy.xml%') as 'start_scenario' ,  filter(count(message), WHERE message like '%NOTICE: Starting pre-deploy%') as 'strt_predply',  filter(count(message), WHERE message like '% INFO: Restoring patch log file%') as 'rstr_ptch_log'  ,  filter(count(message), WHERE message like '%INFO: Updating cache configuration.%') as 'updt_cach_config'  ,  filter(count(message), WHERE message like '%INFO: Set Redis slave connection%') as 'redis_sec_conn_set' ,  filter(count(message), WHERE message like '%INFO: Static content deployment was performed during build hook, cleaning old content%') as 'scd_build_hk',  filter(count(message), WHERE message like '%INFO: Clearing pub/static%') as 'clr_pub_static', filter(count(message), WHERE message LIKE '%NFO: Clearing redis cache:%') as 'clr_redis_cach', filter(count(message), WHERE message LIKE '%INFO: Clearing var/cache directory%') as 'clr_var_cach', filter(count(message), WHERE message LIKE '% NOTICE: Enabling Maintenance mode%') as 'enable_maint_mode', filter(count(message), WHERE message LIKE '%INFO: Disable cron%') as 'disable_cron', filter(count(message), WHERE message LIKE '%INFO: Trying to kill running cron jobs and consumers processes%') as 'kill_cron_try', filter(count(message), WHERE message LIKE '%INFO: Running Magento cron and consumers processes were not found.%') as 'no_cron_fnd', filter(count(message), WHERE message LIKE '%NOTICE: Validating configuration%') as 'validate_config', filter(count(message), WHERE message LIKE '%The following admin data is required to create an admin user during initial installation%') as 'no_admin', filter(count(message), WHERE message LIKE '%recommended PHP version satisfying the constraint%') as 'php_ver_constraint', filter(count(message), WHERE message LIKE '%WARNING: Fix configuration with given suggestions:%') as 'fix_config_sugg',filter(count(message), WHERE message LIKE '%WARNING: [2003] The directory nesting level value for error reporting has not been configured.%') as'nest_err_reporting', filter(count(message), WHERE message LIKE '%NOTICE: End of validation%') as 'end_validation', filter(count(message), WHERE message LIKE '%NOTICE: Starting update.%') as 'start_update', filter(count(message), WHERE message LIKE '%INFO: Updating env.php.%') as 'update_php_env', filter(count(message), WHERE message LIKE '%INFO: Updating env.php DB connection configuration.%') as 'update_php_env_db', filter(count(message), WHERE message LIKE '%INFO: Updating env.php AMQP configuration%') as 'update_php_env_amqp', filter(count(message), WHERE message LIKE '%INFO: Set search engine to: elasticsearch7%') as 'set_elastic7', filter(count(message)*3, WHERE message LIKE '%elasticsearch 6.5.4 has passed EOL%') as 'elastic_ver_EOL', filter(count(message), WHERE message LIKE '%INFO: Set search engine to: elasticsearch6%') as 'set_elastic6', filter(count(message), WHERE message LIKE '%INFO: Updating secure and unsecure URLs%') as 'update_urls', filter(count(message), WHERE message LIKE '%INFO: Running setup upgrade.%') as 'setup_upgrade_run', filter(count(message), WHERE message LIKE '%INFO: Post-deploy hook enabled. Cron enabling, cache cleaning and pre-warming operations are postponed%') as 'post_hook_enabled', filter(count(message), WHERE message LIKE '%NOTICE: Maintenance mode is disabled.%') as 'maint_mode_disabled', filter(count(message), WHERE message LIKE '%INFO: Scenario(s) finished%') as 'scenario_finished', filter(count(message)*20, WHERE message LIKE '%WARNING: Command maintenance:enable finished with an error. Creating a maintenance flag file%') as 'enable_maintenance_fail', filter(count(message)*20, WHERE message LIKE '%MySQL server has gone away%') as 'MySQL_has_gone_away' FROM Log  WHERE ident='deploy.log' OR ident='cloud.log' OR filePath like '%deploy.log%' OR filePath like '%cloud.log%'  TIMESERIES  `
        const deployCloudLogDetail = `SELECT filter(count(message), WHERE message like'%DEBUG: /bin/bash -c "set -o pipefail; php ./bin/cmdb setup:upgrade%') as 'start_update',filter(count(message), WHERE message like '%Cache cleared successful%') as 'cache_clr_succ' ,  filter(count(message), WHERE message like '%Schema creation/updates:%') as 'schema_updates',  filter(count(message), WHERE message like '%Nothing to import.%') as 'mod_import_finish'  ,  filter(count(message), WHERE message like '%NOTICE: End of update.%') as 'update_finished' ,  filter(count(message), WHERE message like '%DEBUG: Running step: deploy-static-content%') as 'scd_run',  filter(count(message), WHERE message like '% NOTICE: Skipping static content deploy. SCD on demand is enabled.%') as 'scd_ondemand', filter(count(message), WHERE message LIKE '%INFO: Clearing%') as 'clr_dirs', filter(count(message), WHERE message LIKE '%DEBUG: Step "deploy-static-content" finished%') as 'scd_finished', filter(count(message), WHERE message LIKE '%NOTICE: Skipping static content compression. SCD on demand is enabled.%') as 'scd_compression_run', filter(count(message), WHERE message LIKE '%NFO: Clearing var/cache directory%') as 'clr_var_cach', filter(count(message), WHERE message LIKE '%DEBUG: Step "compress-static-content" finished%') as 'scd_compression_finished', filter(count(message), WHERE message LIKE '%DEBUG: Running step: deploy-complete%') as 'deploy_finished', filter(count(message), WHERE message LIKE '%INFO: Post-deploy hook enabled. Cron enabling, cache cleaning and pre-warming operations are postponed to post-deploy stage.%') as 'Post_deploy_hook_enabled', filter(count(message), WHERE message LIKE '%NOTICE: Maintenance mode is disabled.%') as 'maint_mode_disabled', filter(count(message), WHERE message LIKE '%INFO: Scenario(s) finished%') as 'scenario_finished', filter(count(message), WHERE message LIKE '%post-deploy.xml%') as 'post_deploy_start', filter(count(message), WHERE message LIKE '%NOTICE: Validating configuration%') as 'validate_config',filter(count(message), WHERE message LIKE '%WARNING: [2003] The directory nesting level value for error reporting has not been configured.%') as 'nest_err_reporting', filter(count(message), WHERE message LIKE '%NOTICE: End of validation%') as 'end_validation', filter(count(message), WHERE message LIKE '%INFO: Enable cron%') as 'enable_cron', filter(count(message), WHERE message LIKE '%INFO: Create backup of important files%') as 'create_backup', filter(count(message), WHERE message LIKE '%DEBUG: Step "backup" finished%') as 'backup_finished', filter(count(message), WHERE message LIKE '%INFO: Starting page warming up%') as 'warmup_start', filter(count(message), WHERE message LIKE '%ERROR: Warming up failed:%') as 'warm_up_fail', filter(count(message), WHERE message LIKE '%DEBUG: Step "warm-up" finished%') as 'warmup_finished', filter(count(message), WHERE message LIKE '% DEBUG: Step "time-to-first-byte" finished%') as 'ttfb_finished', filter(count(message), WHERE message LIKE '%INFO: Scenario(s) finished%') as 'post_deploy_finished',filter(count(message), WHERE message LIKE '%DEBUG: Running step: pre-build%') as 'run_pre-build',filter(count(message), WHERE message LIKE '%DEBUG: Flag .static_content_deploy has already been deleted%') as 'scd_flag_del' ,filter(count(message), WHERE message LIKE '%DEBUG: Step "pre-build" finished%') as 'pre-build_completed' ,filter(count(message), WHERE message LIKE '%NOTICE: Applying patches%') as 'apply_patches',filter(count(message), WHERE message LIKE '%has been applied%') as 'patches_applied' ,filter(count(message), WHERE message LIKE '%DEBUG: Step "apply-patches" finished%') as 'apply_patches_complete'  ,filter(count(message), WHERE message LIKE '%Deploy using quick strategy%') as 'quick_strategy_deploy',filter(count(message), WHERE message LIKE '% NOTICE: Running DI compilation%') as 'di_compliation_start',filter(count(message), WHERE message LIKE '%NOTICE: End of running DI compilation%') as 'di_compliation_finished',filter(count(message), WHERE message LIKE '%NOTICE: Generating fresh static content%') as 'gen_frsh_static_content',filter(count(message), WHERE message LIKE '%cmdb setup:static-content:deploy%') as 'scd_executing',filter(count(message), WHERE message LIKE '%NOTICE: End of generating fresh static content%') as 'gen_frsh_static_cont_finished',filter(count(message), WHERE message LIKE '%INFO: Starting scenario(s): scenario/build/transfer.xml%') as 'start_transferxml',filter(count(message), WHERE message LIKE '%INFO: Trying to kill running cron jobs%') as 'kill_crons',filter(count(message), WHERE message LIKE '%INFO: Clearing redis cache:%') as 'clear_redis_cache',filter(count(message), WHERE message LIKE '%INFO: Checking if db exists and has tables%') as 'db_check',filter(count(message)*10, WHERE message LIKE '%WARNING: [2010] Elasticsearch service is installed at infrastructure layer but is not used as a search engine.%') as 'es_not_used',filter(count(message), WHERE message LIKE '%NOTICE: Starting update.%') as 'starting_update',filter(count(message)*20, WHERE message LIKE '%INFO: Set search engine to: mysql%') as 'mysql_search',filter(count(message)*1000, WHERE message LIKE '%SQLSTATE[HY000] [2006] MySQL server has gone away%') as 'mysql_gone' FROM Log  WHERE ident='cloud.log' OR filePath like '%cloud.log%' TIMESERIES AUTO  `
        const postDeployLogDetail = `SELECT filter(count(message), WHERE message like'%Disabled maintenance mode%') as 'disabled_maint_mode',filter(count(message), WHERE message like '%INFO: Starting scenario(s): scenario/post-deploy.xml%') as 'start_pstdply_scenario' ,  filter(count(message), WHERE message like '% NOTICE: Validating configuration%') as 'val_config',  filter(count(message), WHERE message like '% NOTICE: End of validation%') as 'end_val_config'  ,  filter(count(message), WHERE message like '%INFO: Enable cron%') as 'cron_enabled'  ,  filter(count(message), WHERE message like '% INFO: Create backup of important files.%') as 'file_backup' ,  filter(count(message), WHERE message like '%INFO: Successfully created backup%') as 'file_backup_success',  filter(count(message), WHERE message like '%INFO: Starting page warming up%') as 'pg_warmup_start', filter(count(message), WHERE message LIKE '%INFO: Warmed up page:%') as 'warmed_up_pg', filter(count(message), WHERE message LIKE '%ERROR: Warming up failed:%') as 'warm_up_pg_err', filter(count(message), WHERE message LIKE '% INFO: Scenario(s) finished%') as 'scenario_finished' FROM Log  WHERE ident='post_deploy.log' OR filePath like '%post_deploy.log%' TIMESERIES  `
        const deployCountModules = `Select filter(count(message), WHERE message like '%34mModule %') as 'mod_import'  FROM Log  WHERE ident='deploy.log' OR ident='cloud.log' OR filePath like '%deploy.log%' OR filePath like '%cloud.log%' timeseries `
        const deployModules = `Select message  FROM Log  WHERE ident='cloud.log' OR filePath like '%cloud.log%' WHERE message like '%34mModule %'  limit 1500 `
        const rabbitStartStop = `FROM Log Select filter(count(message), WHERE message like '%RabbitMQ is asked to stop...%') as 'rabbitmq_stop',filter(count(message), WHERE message like '%Starting RabbitMQ%') as 'rabbitmq_start'    timeseries  facet filePath WHERE filePath like '%rabbit@%'  `
        const rabbitError = `FROM Log Select filter(count(message)*50, WHERE message like '%Free disk space is insufficient%') as 'free_space_insufficient',filter(count(message), WHERE message like '%Running boot step rabbit_vhost_limit defined by app rabbit%') as 'bootstrap',filter(count(message), WHERE message like '%at undefined exit with reason noproc in context shutdown_error%') as 'no_proc_undef_exit',filter(count(message), WHERE message like '%exit with reason {case_clause,timeout} and stacktrace [{rabbit_mgmt_wm_healthchecks%') as 'exit_timeout',filter(count(message), WHERE message like '%client unexpectedly closed TCP connection%') as 'client_closed_tcp_conn',filter(count(message), WHERE message like '%at undefined exit with reason shutdown in context shutdown_error%') as 'shutdown_undef_exit',filter(count(message), WHERE message like '%Connection attempt from disallowed node%') as 'disallowed_node',filter(count(message), WHERE message like '%closing AMQP connection%') as 'rmq_err_amqp_conn'    timeseries  facet filePath WHERE filePath like '%rabbit@%'   `
        const rabbitNode = `FROM Log Select filter(count(message), WHERE message like '%rabbit on node rabbit@host1 down%') as 'rmq_node1_down',filter(count(message), WHERE message like '%rabbit on node rabbit@host2 down%') as 'rmq_node2_down',filter(count(message), WHERE message like '%rabbit on node rabbit@host3 down%') as 'rmq_node3_down',filter(count(message), WHERE message like '%rabbit on node rabbit@host1 up%') as 'rmq_node1_up',filter(count(message), WHERE message like '%rabbit on node rabbit@host2 up%') as 'rmq_node2_up',filter(count(message), WHERE message like '%rabbit on node rabbit@host3 up%') as 'rmq_node3_up' timeseries  facet filePath WHERE filePath like '%rabbit@%' OR filePath like '%cron%' `
        const rabbitCommMessages = `FROM Log Select filter(count(message), WHERE message like '%report.ERROR: Cron Job consumers_runner has an error: NOT_FOUND - no queue%') as 'queue_err',filter(count(message), WHERE message like '%accepting AMQP connection%') as 'accepting_conn',filter(count(message), WHERE message like '%authenticated and granted access to vhost%') as 'auth',filter(count(message), WHERE message like '%closing AMQP connection%') as 'close_conn' timeseries  facet filePath WHERE filePath like '%rabbit@%' or filePath like '%cron%'  `
        const rabbitEvents = `SELECT filter(count(summary), WHERE summary like'%Response [error] for node [rabbit@host1]: unexpected http response from%') as 'unexpected_resp_node1',filter(count(summary), WHERE summary like'%Response [error] for node [rabbit@host2]: unexpected http response from%') as 'unexpected_resp_node2',filter(count(summary), WHERE summary like'%Response [error] for node [rabbit@host3]: unexpected http response from%') as 'unexpected_resp_node3',filter(count(summary), WHERE summary like'%Response [error] for node [rabbit@host3]: Get "http://localhost:15672/api/healthchecks/node/rabbit@host3": context deadline exceeded%') as 'node3_timeout_exceeded',filter(count(summary), WHERE summary like'%Response [error] for node [rabbit@host1]: Get "http://localhost:15672/api/healthchecks/node/rabbit@host1": context deadline exceeded%') as 'node1_timeout_exceeded',filter(count(summary), WHERE summary like'%Response [error] for node [rabbit@host2]: Get "http://localhost:15672/api/healthchecks/node/rabbit@host2": context deadline exceeded%') as 'node2_timeout_exceeded',filter(count(summary), WHERE summary like'%401 Unauthorized%') as '401_unauth',filter(count(summary), WHERE summary like'%401 Unauthorized%') as '401_unauth',filter(count(summary), WHERE summary like'%Service restarted: rabbitmq-server%') as 'rmq_service_restart',filter(count(summary), WHERE summary like'%Response [failed] for node [rabbit@host1]: nodedown%') as 'rmq_node1_down',filter(count(summary), WHERE summary like'%Response [failed] for node [rabbit@host2]: nodedown%') as 'rmq_node2_down',filter(count(summary), WHERE summary like'%Response [failed] for node [rabbit@host3]: nodedown%') as 'rmq_node3_down',filter(count(summary), WHERE summary like'%Entity modified: exchange/bindings.destination%') as 'rmq_entity_modified',filter(count(summary), WHERE summary like'%Entity created: exchange/bindings.destination%') as 'rmq_entity_created',filter(count(summary), WHERE summary like'%Entity modified: queue/exclusive%') as 'rmq_entity_created_q_exclusive',filter(count(summary), WHERE summary like'%Entity modified: queue/auto_delete%') as 'rmq_entity_q_delete',filter(count(summary), WHERE summary like'%Entity modified: queue/durable%') as 'rmq_entity_modified_q_durable',filter(count(summary), WHERE summary like'%Entity modified: version/management%') as 'rmq_entity_modified_ver_mgt',filter(count(summary), WHERE summary like'%Entity modified: version/rabbitmq%') as 'rmq_entity_modified_ver_rmq' from InfrastructureEvent timeseries `
        const rabbitMessagesSummary = `SELECT latest(exchange.messagesPublishedQueue) from RabbitmqExchangeSample TIMESERIES facet entityName,displayName `
        const rabbitQueueConsumption = `SELECT average(queue.erlangBytesConsumedInBytes) FROM RabbitmqQueueSample TIMESERIES FACET entityName `
        const rabbitPublishedByQueue = `SELECT average(queue.messagesPublished) FROM RabbitmqQueueSample TIMESERIES   FACET entityName `
        const rabbitPublishedThroughputByQueue = `SELECT average(queue.messagesPublishedPerSecond) FROM RabbitmqQueueSample TIMESERIES  FACET entityName `
        const rabbitTotalMsgThroughputByQueue = `SELECT average(queue.totalMessagesPerSecond) FROM RabbitmqQueueSample TIMESERIES  FACET entityName `
        const rabbitConsumersByQueue = `SELECT average(queue.consumers) FROM RabbitmqQueueSample TIMESERIES  FACET entityName `
        const ordersTran = `SELECT count('request.headers.host') as 'orders' FROM Transaction WHERE 'request.headers.host' IS NOT NULL  and name='WebTransaction/Action/checkout/onepage/success'  COMPARE WITH 1 week ago TIMESERIES  `
        const CatSize = `from Cron SELECT average(CatalogCategoryCount) as 'Categories',average(productCatalogSize) as 'Products', average(productCatalogActiveSize) as 'Active products'   COMPARE WITH 1 week ago TIMESERIES  `
        const cpuUsage = `FROM ProcessSample SELECT average(cpuSystemPercent)*100 FACET apmApplicationNames,hostname TIMESERIES  `
        /*const elastic = `SELECT average('index.storeSizeInBytes') FROM ElasticsearchIndexSample FACET displayName TIMESERIES `*/
        const elastic = `SELECT latest(elasticsearch.index.replicaShards ) FROM Metric FACET elasticsearch.indexHealth  timeseries  `
        const elastic2 = `SELECT latest(elasticsearch.index.replicaShards ) FROM Metric FACET elasticsearch.indexHealth  timeseries  `
        const elasticIndexSz = `SELECT average(index.storeSizeInBytes) from ElasticsearchIndexSample timeseries facet entityName  `
        const storUsedMySql = `SELECT average(diskUsedPercent) FROM StorageSample TIMESERIES FACET hostname,mountPoint  EXTRAPOLATE WHERE mountPoint like '%mysql%' OR mountPoint like '%/%' OR mountPoint Like'%/var/log%' OR mountPoint like '%/tmp%'  `
        const storFreeMySql = `SELECT (max(diskFreePercent)) FROM StorageSample TIMESERIES FACET hostname,mountPoint,apmApplicationNames where mountPoint like '/tmp' OR mountPoint like '/data/mysql' OR mountPoint like '/' LIMIT 100  `
        const storUsed = `SELECT average(diskUsedPercent) FROM StorageSample TIMESERIES FACET mountPoint  EXTRAPOLATE  `
        const storFree = `SELECT (max(diskFreePercent)) FROM StorageSample TIMESERIES FACET mountPoint,apmApplicationNames  EXTRAPOLATE limit max `
        const phpProc = `SELECT count(processDisplayName) FROM ProcessSample WHERE processDisplayName LIKE 'php%' FACET apmApplicationNames,processDisplayName TIMESERIES AUTO  `
        /*const phpProcDetail = `SELECT count(processDisplayName) FROM ProcessSample WHERE processDisplayName LIKE 'php%' FACET hostname TIMESERIES AUTO `*/
        const phpProcDetail = `SELECT filter(count(processDisplayName), WHERE cpuUserPercent > 0 ) AS 'activeProcesses', filter(count(processDisplayName), WHERE cpuUserPercent = 0 ) AS 'idleProcesses' FROM ProcessSample  COMPARE WITH 1 WEEK AGO WHERE processDisplayName Like '%php-fpm%' AND cpuUserPercent > 0 facet processDisplayName TIMESERIES `
        const phpCPUProcDetail = `SELECT filter(count(processDisplayName), WHERE cpuUserPercent < 25 ) AS 'CPU_25%<Processes', filter(count(processDisplayName), WHERE cpuUserPercent >=25 AND cpuUserPercent <=50  ) AS '>CPU_25to50%>Processes', filter(count(processDisplayName), WHERE cpuUserPercent >=50 ) AS '>CPU_50%>Processes' FROM ProcessSample  COMPARE WITH 1 WEEK AGO WHERE processDisplayName Like '%php-fpm%' AND cpuUserPercent > 0 facet processDisplayName TIMESERIES  `
        const phpMemoryDetail = `SELECT average(memoryResidentSizeBytes) FROM ProcessSample WHERE processDisplayName Like '%php%'  TIMESERIES facet apmApplicationNames,processDisplayName  `
        const phpCPUProcPct = `SELECT average(cpuUserPercent) FROM ProcessSample  WHERE processDisplayName like 'php%' facet processDisplayName timeseries   `
        const secProc = `SELECT max(cpuPercent) FROM ProcessSample TIMESERIES FACET processDisplayName WHERE processDisplayName not like 'php%'  `
        const memFree = `SELECT average(memoryFreePercent) FROM SystemSample facet hostname  TIMESERIES `
        /*const swapFreeBytes = `SELECT average(swapFreeBytes) FROM SystemSample facet hostname TIMESERIES   `*/
        const swapFreePer = `SELECT min(swapFreeBytes)/min(swapTotalBytes)*100 as free_percentage FROM SystemSample facet hostname TIMESERIES `
        const cpuHost = `SELECT average(cpuPercent) FROM SystemSample  facet apmApplicationNames, hostname TIMESERIES `
        const elasticUnassignedShards = `FROM Metric SELECT latest(elasticsearch.cluster.shards.unassigned) TIMESERIES  `
        const paintLoad = `SSELECT percentile(firstPaint, 50), percentile(firstContentfulPaint, 50), percentile(largestContentfulPaint, 50), percentile(windowLoad, 50), percentile(firstInteraction, 50) FROM PageViewTiming TIMESERIES EXTRAPOLATE `
        const orderDur = `select histogram(duration) from Transaction where name like '%order%'  `
        const potBot = `SELECT count(*) from Log WHERE client_ip IS NOT NULL AND ( request_user_agent IS NULL OR request_user_agent LIKE '%Bot%' ) facet client_ip TIMESERIES MAX  `
        const dbTrace = `SELECT count(*) FROM SqlTrace FACET path  TIMESERIES  `
        const elasticErr = `FROM Log SELECT   filter(count(message), WHERE message like '%elasticsearch exited with return%') as 'es_exited',filter(count(message), WHERE message like '%java.net.ConnectException: Connection refused%') as 'es_conn_refused',filter(count(message), WHERE message like '%java.lang.OutOfMemoryError%') as 'es_memory_heap',filter(count(message), WHERE message like '%Data too large%') as 'es_memory_heap',filter(count(message), WHERE message like '%TransportError%') as 'transport_err',filter(count(message), WHERE message like '%no alive nodes%') as 'no_alive_nodes',filter(count(message), WHERE message like '%all shards failed%') as 'all_shards_failed',  filter(count(message), WHERE message like '%NoNodesAvailableException%') as 'no_alive_nodes',  filter(count(message), WHERE message like '%PHP Fatal error:  Uncaught Error: Wrong parameters for Elasticsearch%') as 'wrong_param',filter(count(message), WHERE message like '%You can fix this issue by upgrading the Elasticsearch service on your Magento Cloud infrastructure to version%') as 'ver_err', filter(count(message), WHERE message like '%cluster health status changed from [YELLOW] to [RED] (reason:%') as 'yel_red', filter(count(message), WHERE message like '%No space left on device%') as 'no_space', filter(count(message), where message like '% Failed to execute [SearchRequest{searchType=%') as 'failed_query'  timeseries WHERE apmApplicationNames not like '%_stg%' `
        const elasticState = `SELECT filter(uniqueCount(entityId), WHERE cluster.status = 'green') AS 'Green', filter(uniqueCount(entityId), WHERE cluster.status = 'yellow') AS 'Yellow', filter(uniqueCount(entityId), WHERE cluster.status = 'red') AS 'Red' FROM ElasticsearchClusterSample facet hostname timeseries `
        const elasticGc = `FROM Log select filter(count(message), where message like '%collecting in the last%') as 'garbage_collection' WHERE (filePath like '%gc.log%' OR filePath like '%elasticsearch.log%') timeseries  `
        const elasticProc = `SELECT average(cpuPercent) FROM ProcessSample facet processDisplayName,apmApplicationNames where processDisplayName like 'elasticsearch' TIMESERIES  `
        const elasticClustSum = `SELECT filter(uniqueCount(entityId), where cluster.status = 'green') as 'Green', filter(uniqueCount(entityId), where cluster.status = 'yellow') as 'Yellow', filter(uniqueCount(entityId), where cluster.status = 'red') as 'Red' from ElasticsearchClusterSample  `
        const elasticActPriShards = `SELECT latest(shards.primaryActive) as 'Active Primary Shards' from ElasticsearchClusterSample  `
        const elasticActShardsClust = `SELECT latest(shards.active) as 'Active Shards in Cluster' from ElasticsearchClusterSample  `
        const elasticIndexHealth = `SELECT filter(uniqueCount(index.health), where index.health = 'green') as 'Green', filter(uniqueCount(index.health), where index.health = 'yellow') as 'Yellow', filter(uniqueCount(index.health), where index.health = 'red') as 'Red' from ElasticsearchIndexSample  facet displayName `
        const elasticIndexInfo = `SELECT timestamp, displayName,hostname,index.docs, index.health, index.storeSizeInBytes/1024/1024 as 'index.store size in MB' from ElasticsearchIndexSample `
        const cronJob = `SELECT filter(count(message), WHERE message like '%start%') as 'cron_start',  filter(count(message), WHERE message like '%finished%') as 'cron_fin'  FROM Log WHERE ident = 'cron.log' or filePath like '%cron.log%' timeseries `
        /*const dbErrors1 = `SELECT  filter(count(message), WHERE message like '%Memory size allocated for the temporary table is more than 20% of innodb_buffer_pool_size%') as 'temp_tbl_buff_pool',filter(count(message), WHERE message like '%[ERROR] WSREP: rbr write fail%') as 'rbr_write_fail',filter(count(message), WHERE message like '%mysqld: Disk full%') as 'disk_full',filter(count(message), WHERE message like '%Error number 28%') as 'err_28',filter(count(message), WHERE message like '%rollback%') as 'rollback',filter(count(message), WHERE message like '%Foreign key constraint fails for table%') as 'foreign_key_constraint', filter(count(message)*100, WHERE message like '%Error_code: 1114%') as 'sql_1114_full',filter(count(message)*100, WHERE message like '%CRITICAL: SQLSTATE[HY000] [2006] MySQL server has gone away%') as 'sql_gone',  filter(count(message), WHERE message like '%SQLSTATE[HY000] [1040] Too many connections%') as 'sql_1040',  filter(count(message), WHERE message like '%CRITICAL: SQLSTATE[HY000] [2002]%') as 'sql_2002',  filter(count(message), WHERE message like '%SQLSTATE[08S01]:%') as 'sql_1047',  filter(count(message), WHERE message like '%[Warning] Aborted connection%') as 'aborted_conn',  filter(count(message), WHERE message like '%SQLSTATE[23000]: Integrity constraint violation:%') as 'sql_23000',  filter(count(message), WHERE message like '%1205 Lock wait timeout%') as 'sql_1205',  filter(count(message), WHERE message like '%SQLSTATE[HY000] [1049] Unknown database%') as 'sql_1049',  filter(count(message), WHERE message like '%SQLSTATE[42S02]: Base table or view not found:%') as 'sql_42S02',  filter(count(message)*100, WHERE message like '%General error: 1114%') as 'sql_1114' ,    filter(count(message), WHERE message like '%SQLSTATE[40001]%') as 'sql_1213',filter(count(message), WHERE message like '%SQLSTATE[42S22]: Column not found: 1054 Unknown column%') as 'sq1_1054' ,  filter(count(message), WHERE message like '%SQLSTATE[42000]: Syntax error or access violation:%') as 'sql_42000',  filter(count(message), WHERE message like '%SQLSTATE[21000]: Cardinality violation:%') as 'sql_1241', filter(count(message), WHERE message like '%SQLSTATE[22003]:%') as 'sql_22003' ,  filter(count(message), WHERE message like '%SQLSTATE[HY000] [9000] Client with IP address%') as 'sql_9000' ,  filter(count(message), WHERE message like '%SQLSTATE[HY000]: General error: 2014%') as 'sql_2014', filter(count(message), WHERE message like '%1927 Connection was killed%') as 'sql_1927',filter(count(message), WHERE message like '%1062 [ERROR] InnoDB:%') as 'sql_1062_e',filter(count(message), WHERE message like '%[Note] WSREP: Flushing memory map to disk...%') as 'mem_map_flush',filter(count(message), WHERE message like '%Internal MariaDB error code: 1146%') as 'sql_1146',filter(count(message), WHERE message like '%Internal MariaDB error code: 1062%') as 'sql_1062',filter(count(message), WHERE message like '%1062 [Warning] InnoDB:%') as 'sql_1062_w',filter(count(message), WHERE message like '%Internal MariaDB error code: 1064%') as 'sql_1064',filter(count(message)*10000, WHERE message like '%InnoDB: Assertion failure in file%') as 'assertion_err',filter(count(message)*100, WHERE message like '%mysqld_safe Number of processes running now: 0%') as 'mysql_oom',filter(count(message)*100, WHERE message like '%[ERROR] mysqld got signal%') as 'mysql_sigterm',filter(count(message), WHERE message like '%1452 Cannot add%') as 'sql_1452',filter(count(message), WHERE message like '%ERROR 1698%') as 'sql_1698',filter(count(message), WHERE message like '%SQLSTATE[HY000]: General error: 3%') as 'cnt_wrt_tmp',filter(count(message), WHERE message like '%General error: 1 %') as 'sql_syntax',filter(count(message), WHERE message like '%42S22%') as 'sql_42S22' ,filter(count(message), WHERE message like '%InnoDB: Error (Duplicate key)%') as 'innodb_dup_key' FROM Log TIMESERIES `*/
        const dbErrors1 = `SELECT  filter(count(message), WHERE message like '%No space left on device%') as 'no_space',filter(count(message), WHERE message like '%Memory size allocated for the temporary table is more than 20% of innodb_buffer_pool_size%') as 'temp_tbl_buff_pool',filter(count(message), WHERE message like '%[ERROR] WSREP: rbr write fail%') as 'rbr_write_fail',filter(count(message), WHERE message like '%mysqld: Disk full%') as 'disk_full',filter(count(message), WHERE message like '%errorno 28%') as 'err_28',filter(count(message), WHERE message like '%Errcode: 28%') as 'err_28',filter(count(message), WHERE message like '%OS errno 28%') as 'err_28',filter(count(message), WHERE message like '%error 28%') as 'err_28',filter(count(message), WHERE message like '%Error while writing%') as 'mysql_nospace',filter(count(message), WHERE message like '%rollback%') as 'rollback',filter(count(message), WHERE message like '%Foreign key constraint fails for table%') as 'foreign_key_constraint', filter(count(message)*100, WHERE message like '%Error_code: 1114%') as 'sql_1114_full',filter(count(message)*100, WHERE message like '%CRITICAL: SQLSTATE[HY000] [2006] MySQL server has gone away%') as 'sql_gone',  filter(count(message), WHERE message like '%SQLSTATE[HY000] [1040] Too many connections%') as 'sql_1040',  filter(count(message), WHERE message like '%CRITICAL: SQLSTATE[HY000] [2002]%') as 'sql_2002',  filter(count(message), WHERE message like '%SQLSTATE[08S01]:%') as 'sql_1047',  filter(count(message), WHERE message like '%[Warning] Aborted connection%') as 'aborted_conn',  filter(count(message), WHERE message like '%SQLSTATE[23000]: Integrity constraint violation:%') as 'sql_23000',  filter(count(message), WHERE message like '%1205 Lock wait timeout%') as 'sql_1205',  filter(count(message), WHERE message like '%SQLSTATE[HY000] [1049] Unknown database%') as 'sql_1049',  filter(count(message), WHERE message like '%SQLSTATE[42S02]: Base table or view not found:%') as 'sql_42S02',  filter(count(message)*100, WHERE message like '%General error: 1114%') as 'sql_1114' ,    filter(count(message), WHERE message like '%SQLSTATE[40001]%') as 'sql_1213',filter(count(message), WHERE message like '%SQLSTATE[42S22]: Column not found: 1054 Unknown column%') as 'sq1_1054' ,  filter(count(message), WHERE message like '%SQLSTATE[42000]: Syntax error or access violation:%') as 'sql_42000',  filter(count(message), WHERE message like '%SQLSTATE[21000]: Cardinality violation:%') as 'sql_1241', filter(count(message), WHERE message like '%SQLSTATE[22003]:%') as 'sql_22003' ,  filter(count(message), WHERE message like '%SQLSTATE[HY000] [9000] Client with IP address%') as 'sql_9000' ,  filter(count(message), WHERE message like '%SQLSTATE[HY000]: General error: 2014%') as 'sql_2014', filter(count(message), WHERE message like '%1927 Connection was killed%') as 'sql_1927',filter(count(message), WHERE message like '%1062 [ERROR] InnoDB:%') as 'sql_1062_e',filter(count(message), WHERE message like '%[Note] WSREP: Flushing memory map to disk...%') as 'mem_map_flush',filter(count(message), WHERE message like '%Internal MariaDB error code: 1146%') as 'sql_1146',filter(count(message), WHERE message like '%Internal MariaDB error code: 1062%') as 'sql_1062',filter(count(message), WHERE message like '%1062 [Warning] InnoDB:%') as 'sql_1062_w',filter(count(message), WHERE message like '%Internal MariaDB error code: 1064%') as 'sql_1064',filter(count(message)*10000, WHERE message like '%InnoDB: Assertion failure in file%') as 'assertion_err',filter(count(message)*100, WHERE message like '%mysqld_safe Number of processes running now: 0%') as 'mysql_oom',filter(count(message)*100, WHERE message like '%[ERROR] mysqld got signal%') as 'mysql_sigterm',filter(count(message), WHERE message like '%1452 Cannot add%') as 'sql_1452',filter(count(message), WHERE message like '%ERROR 1698%') as 'sql_1698',filter(count(message), WHERE message like '%SQLSTATE[HY000]: General error: 3%') as 'cnt_wrt_tmp',filter(count(message), WHERE message like '%General error: 1 %') as 'sql_syntax',filter(count(message), WHERE message like '%42S22%') as 'sql_42S22' ,filter(count(message), WHERE message like '%InnoDB: Error (Duplicate key)%') as 'innodb_dup_key',filter(count(message), WHERE message like '%mysqld: Disk full%') as 'disk_full',filter(count(message), WHERE message like '%1021 Disk full%') as 'mysql_nospace',filter(count(message), WHERE message like '%ERROR 1021 (HY000): Database out of space%') as 'mysql_nospace',filter(count(message), WHERE message like '%SQLSTATE[HY000] [1021] Database out of space%') as 'mysql_nospace',filter(count(message), WHERE message like '%1021 Database out of space%') as 'mysql_nospace',filter(count(message), WHERE message like '%Database out of space%') as 'mysql_nospace',filter(count(message), WHERE message like '%SQLSTATE[HY000] [1021] Database out of space%') as 'mysql_nospace',filter(count(message), WHERE message like '%SQLSTATE[HY000] [1021] Database out of space%') as 'mysql_nospace',filter(count(message), WHERE message like '%SQLSTATE[HY000] [1021] Database out of space%') as 'mysql_nospace',filter(count(message), WHERE message like '%/var/log: Input/output error%') as 'mysql_nospace',filter(count(message), WHERE message like '%error: 1021%') as 'mysql_nospace',filter(count(message), WHERE message like '%Error 1021%') as 'mysql_nospace',filter(count(message), WHERE message like '%Disk full (/tmp') as 'tmp_nospace',filter(count(message), WHERE message like '%tmp is full%') as 'tmp_nospace',filter(count(message), WHERE message like '%SQLSTATE[HY000] [1021] Database out of space%') as 'mysql_nospace',filter(count(message), WHERE message like '%errno=28 No space left on device%') as 'mysql_nospace',filter(count(message), WHERE message like '%MySQL went away%') as 'mysql_went_away',filter(count(message), WHERE message like '%1047 WSREP has not yet prepared node for application use Import error%') as 'mysql_not_prepared',filter(count(message), WHERE message like '%General error: 1180 Got error 5%') as 'mysql_nospace',filter(count(message), WHERE message like '%SInnoDB: Error (Out of disk space) writing word node%') as 'mysql_nospace',filter(count(message), WHERE message like '%1114 The table%') as 'mysql_nospace',filter(count(message), WHERE message like '%General error: 3 Error writing file%') as 'mysql_nospace',filter(count(message), WHERE message like '%SQLSTATE[HY000] [1021] Database out of space%') as 'mysql_nospace',filter(count(message), WHERE message like '%SQLSTATE[HY000] [1021] Database out of space%') as 'mysql_nospace',filter(count(message), WHERE message like '%SQLSTATE[HY000] [1021] Database out of space%') as 'mysql_nospace',filter(count(message), WHERE message like '%mysqld: Disk full%') as 'disk_full',filter(count(message), WHERE message like '%CRITICAL: SQLSTATE[HY000] [2002] Connection timed out%') as 'sql_2002',filter(count(message), WHERE message like '%ERROR 1452%') as 'sql_1452',filter(count(message), WHERE message like '%SQLSTATE[HY000] [2002] Connection refused%') as 'sql_2002',filter(count(message), WHERE message like '%General error: 14 Can%t change size of file%') as 'mysql_nospace' FROM Log TIMESERIES facet apmApplicationNames `
        const dbStatusErr = `FROM Log SELECT count(client_ip) AS 'ip_address' WHERE filePath is NULL and status != 200 LIMIT 50 facet status  timeseries `
        const cron_sched = `FROM Log SELECT filter(count(message), WHERE message like '%get lock; try restarting transaction, query was: DELETE FROM \`cron_schedule%') as cron_sched_lock_del,filter(count(message), WHERE message like '%cron_schedule%') as 'cron_sched',filter(count(message), WHERE message like '%indexer_update_all_views%') as 'indexer_update_all_views'  TIMESERIES `
        const deadlock = `FROM Log SELECT filter(count(message)*5000, WHERE message like '%PHP Fatal error:  Allowed memory size of%') as php_mem_error,filter(count(message)*5000, WHERE message like '%PHP Fatal error:  Allowed memory size of%') as php_mem_error,filter(count(message), WHERE message like '%get lock; try restarting transaction, query was: DELETE FROM \`cron_schedule%') as cron_sched_lock_del,filter(count(message), WHERE message like '% lock for cron job: indexer_reindex_all_invalid%') as 'lock_indexer_reindex_all_invalid%',filter(count(message), WHERE message like '% lock for cron job: cron_schedule%') as 'lock_cron_schedule',filter(count(message), WHERE message like '% lock for cron job:%') as 'total_cron_lock',filter(count(message), WHERE message like '%General error: 1205 Lock wait timeout exceeded%') as 'sql_1205_lock',filter(count(message), WHERE message like '%ERROR 1213 (40001): Deadlock found when trying to get lock%') as 'sql_1213_lock',filter(count(message), WHERE message like '%SQLSTATE[40001]: Serialization failure: 1213 Deadlock found%') as 'sql_1213_lock2',filter(count(message), WHERE message like '% lock for cron job: indexer_update_all_views%') as 'lock_indexer_update_all_views',filter(count(message), WHERE message like '% lock for cron job: sales_grid_order_invoice_async_insert%') as 'lock_sales_grid_order_invoice_async_insert',filter(count(message), WHERE message like '% lock for cron job: staging_remove_updates%') as 'lock_staging_remove_updates',filter(count(message), WHERE message like '% lock for cron job: sales_grid_order_shipment_async_insert%') as 'lock_sales_grid_order_shipment_async_insert',filter(count(message), WHERE message like '% lock for cron job: amazon_payments_process_queued_refunds%') as 'lock_amazon_payments_process_queued_refunds',filter(count(message), WHERE message like '% lock for cron job: sales_send_order_shipment_emails%') as 'lock_sales_send_order_shipment_emails',filter(count(message), WHERE message like '% lock for cron job: staging_synchronize_entities_period%') as 'lock_staging_synchronize_entities_period',filter(count(message), WHERE message like '% lock for cron job: indexer_clean_all_changelogs%') as 'lock_indexer_clean_all_changelogs',filter(count(message), WHERE message like '% lock for cron job: magento_targetrule_index_reindex%') as 'lock_magento_targetrule_index_reindex',filter(count(message), WHERE message like '% lock for cron job: newsletter_send_all%') as 'lock_newsletter_send_all',filter(count(message), WHERE message like '% lock for cron job: sales_grid_order_async_insert%') as 'lock_sales_grid_order_async_insert',filter(count(message), WHERE message like '% lock for cron job: sales_send_order_emails%') as 'lock_sales_send_order_emails',filter(count(message), WHERE message like '% lock for cron job: sales_send_order_creditmemo_emails%') as 'lock_sales_send_order_creditmemo_emails',filter(count(message), WHERE message like '% lock for cron job: sales_grid_order_creditmemo_async_insert%') as 'lock_sales_grid_order_creditmemo_async_insert',filter(count(message), WHERE message like '% lock for cron job: bulk_cleanup%') as 'lock_bulk_cleanup',filter(count(message), WHERE message like '% lock for cron job: flush_preview_quotas%') as 'lock_flush_preview_quotas',filter(count(message), WHERE message like '% lock for cron job: sales_send_order_invoice_emails%') as 'lock_sales_send_order_invoice_emails',filter(count(message), WHERE message like '% lock for cron job: ddg_automation_order_sync%') as 'lock_ddg_automation_order_sync',filter(count(message), WHERE message like '% lock for cron job: captcha_delete_expired_images%') as 'lock_captcha_delete_expired_images',filter(count(message), WHERE message like '% lock for cron job: magento_newrelicreporting_cron%') as 'lock_magento_newrelicreporting_cron',filter(count(message), WHERE message like '% lock for cron job: outdated_authentication_failures_cleanup%') as 'lock_outdated_authentication_failures_cleanup',filter(count(message), WHERE message like '% lock for cron job: send_notification%') as 'lock_send_notification',filter(count(message), WHERE message like '% lock for cron job: magento_giftcardaccount_generage_codes_pool%') as 'lock_magento_giftcardaccount_generage_codes_pool',filter(count(message), WHERE message like '% lock for cron job: catalog_product_frontend_actions_flush%') as 'lock_catalog_product_frontend_actions_flush',filter(count(message), WHERE message like '% lock for cron job: mysqlmq_clean_messages%') as 'mysqlmq_clean_messages',filter(count(message), WHERE message like '% lock for cron job: catalog_product_attribute_value_synchronize%') as 'lock_catalog_product_attribute_value_synchronize',filter(count(message), WHERE message like '% lock for cron job: ddg_automation_importer%') as 'lock_ddg_automation_importer',filter(count(message), WHERE message like '% lock for cron job: ddg_automation_reviews_and_wishlist%') as 'lock_ddg_automation_reviews_and_wishlist',filter(count(message), WHERE message like '% lock for cron job: captcha_delete_old_attempts%') as 'lock_captcha_delete_old_attempts',filter(count(message), WHERE message like '% lock for cron job: catalog_product_outdated_price_values_cleanup%') as 'lock_catalog_product_outdated_price_values_cleanup',filter(count(message), WHERE message like '% lock for cron job: consumers_runner%') as 'lock_consumers_runner',filter(count(message), WHERE message like '% lock for cron job: ddg_automation_customer_subscriber_guest_sync%') as 'lock_ddg_automation_customer_subscriber_guest_sync',filter(count(message), WHERE message like '% lock for cron job: get_amazon_capture_updates%') as 'lock_get_amazon_capture_updates',filter(count(message), WHERE message like '% lock for cron job: get_amazon_authorization_updates%') as 'lock_send_get_amazon_authorization_updates',filter(count(message), WHERE message like '% lock for cron job: temando_process_platform_events%') as 'lock_temando_process_platform_events',filter(count(message), WHERE message like '% lock for cron job: ddg_automation_status%') as 'lock_ddg_automation_status',filter(count(message), WHERE message like '% lock for cron job: massproductimport_run%') as 'lock_massproductimport_run',filter(count(message), WHERE message like '% lock for cron job: sales_clean_orders%') as 'lock_sales_clean_orders',filter(count(message), WHERE message like '% lock for cron job: catalog_index_refresh_price%') as 'lock_catalog_index_refresh_price',filter(count(message), WHERE message like '% lock for cron job: magento_reward_balance_warning_notification%') as 'lock_magento_reward_balance_warning_notification',filter(count(message), WHERE message like '% lock for cron job: analytics_update%') as 'lock_analytics_update',filter(count(message), WHERE message like '% lock for cron job: messagequeue_clean_outdated_locks%') as 'lock_messagequeue_clean_outdated_locks',filter(count(message), WHERE message like '% lock for cron job: expired_tokens_cleanup%') as 'lock_expired_tokens_cleanup',filter(count(message), WHERE message like '% lock for cron job: staging_apply_version%') as 'lock_staging_apply_version',filter(count(message), WHERE message like '% lock for cron job: magento_reward_expire_points%') as 'lock_magento_reward_expire_points',filter(count(message), WHERE message like '% lock for cron job: yotpo_yotpo_orders_sync%') as 'lock_yotpo_yotpo_orders_sync',filter(count(message), WHERE message like '% lock for cron job: catalog_event_status_checker%') as 'lock_catalog_event_status_checker',filter(count(message), WHERE message like '% lock for cron job: ddg_automation_campaign%') as 'lock_ddg_automation_campaign',filter(count(message), WHERE message like '% lock for cron job: visitor_clean%') as 'lock_visitor_clean',filter(count(message), WHERE message like '% lock for cron job: scconnector_verify_website%') as 'lock_scconnector_verify_website',filter(count(message), WHERE message like '% lock for cron job: ddg_automation_email_templates%') as 'lock_ddg_automation_email_templates',filter(count(message), WHERE message like '% lock for cron job: aggregate_sales_report_order_data%') as 'lock_aggregate_sales_report_order_data',filter(count(message), WHERE message like '% lock for cron job: ddg_automation_catalog_sync%') as 'lock_ddg_automation_catalog_sync'  TIMESERIES `
        //const dbErrorsTable = `SELECT  filter(count(message), WHERE message like '%mysqld: Disk full%') as 'disk_full',filter(count(message), WHERE message like '%Error number 28%') as 'err_28',filter(count(message), WHERE message like '%rollback%') as 'rollback',filter(count(message), WHERE message like '%Foreign key constraint fails for table%') as 'foreign_key_constraint', filter(count(message), WHERE message like '%Error_code: 1114%') as 'sql_1114_full',filter(count(message), WHERE message like '%CRITICAL: SQLSTATE[HY000] [2006] MySQL server has gone away%') as 'sql_gone',  filter(count(message), WHERE message like '%SQLSTATE[HY000] [1040] Too many connections%') as 'sql_1040',  filter(count(message), WHERE message like '%CRITICAL: SQLSTATE[HY000] [2002] Connection timed out%') as 'sql_2002',  filter(count(message), WHERE message like '%SQLSTATE[08S01]:%') as 'sql_1047',  filter(count(message), WHERE message like '%[Warning] Aborted connection%') as 'aborted_conn' ,  filter(count(message), WHERE message like '%SQLSTATE[23000]: Integrity constraint violation:%') as 'sql_23000',  filter(count(message), WHERE message like '%1205 Lock wait timeout%') as 'sql_1205',  filter(count(message), WHERE message like '%SQLSTATE[HY000] [1049] Unknown database%') as 'sql_1049',  filter(count(message), WHERE message like '%SQLSTATE[42S02]: Base table or view not found:%') as 'sql_42S02',  filter(count(message), WHERE message like '%General error: 1114%') as 'sql_1114' ,  filter(count(message), WHERE message like '%SQLSTATE[HY000] [2002]%') as 'sql_2002' ,  filter(count(message), WHERE message like '%SQLSTATE[40001]%') as 'sql_1213',filter(count(message), WHERE message like '%SQLSTATE[42S22]: Column not found: 1054 Unknown column%') as 'sq1_1054' ,  filter(count(message), WHERE message like '%SQLSTATE[42000]: Syntax error or access violation:%') as 'sql_42000',  filter(count(message), WHERE message like '%SQLSTATE[HY000] [2002] Connection refused%') as 'sql_2002' ,  filter(count(message), WHERE message like '%SQLSTATE[21000]: Cardinality violation:%') as 'sql_1241',  filter(count(message), WHERE message like '%SQLSTATE[HY000] [2002] Connection timed out%') as 'sql_2002' ,  filter(count(message), WHERE message like '%SQLSTATE[22003]:%') as 'sql_22003' ,  filter(count(message), WHERE message like '%SQLSTATE[HY000] [9000] Client with IP address%') as 'sql_9000' ,  filter(count(message), WHERE message like '%SQLSTATE[HY000]: General error: 2014%') as 'sql_2014', filter(count(message), WHERE message like '%1927 Connection was killed%') as 'sql_1927',filter(count(message), WHERE message like '%1062 [ERROR] InnoDB:%') as 'sql_1062_e',filter(count(message), WHERE message like '%[Note] WSREP: Flushing memory map to disk...%') as 'mem_map_flush',filter(count(message), WHERE message like '%Internal MariaDB error code: 1146%') as 'sql_1146',filter(count(message), WHERE message like '%Internal MariaDB error code: 1062%') as 'sql_1062',filter(count(message), WHERE message like '%1062 [Warning] InnoDB:%') as 'sql_1062_w',filter(count(message), WHERE message like '%Internal MariaDB error code: 1064%') as 'sql_1064',filter(count(message)*10000, WHERE message like '%InnoDB: Assertion failure in file%') as 'assertion_err',filter(count(message), WHERE message like '%mysqld_safe Number of processes running now: 0%') as 'mysql_oom',filter(count(message), WHERE message like '%[ERROR] mysqld got signal%') as 'mysql_sigterm',filter(count(message), WHERE message like '%1452 Cannot add%') as 'sql_1452',filter(count(message), WHERE message like '%ERROR 1452%') as 'sql_1452',filter(count(message), WHERE message like '%ERROR 1698%') as 'sql_1698',filter(count(message), WHERE message like '%SQLSTATE[HY000]: General error: 3%') as 'cnt_wrt_tmp',filter(count(message), WHERE message like '%General error: 1 %') as 'sql_syntax',filter(count(message), WHERE message like '%42S02%') as 'sql_42S02%',filter(count(message), WHERE message like '%42S22%') as 'sql_42S22',filter(count(message), WHERE message like '%InnoDB: Error (Duplicate key)%') as 'innodb_dup_key' FROM Log  facet hostname `
        const dbErrorsTable =`SELECT  filter(count(message), WHERE message like '%Memory size allocated for the temporary table is more than 20% of innodb_buffer_pool_size%') as 'temp_tbl_buff_pool',filter(count(message), WHERE message like '%[ERROR] WSREP: rbr write fail%') as 'rbr_write_fail',filter(count(message), WHERE message like '%mysqld: Disk full%') as 'disk_full',filter(count(message), WHERE message like '%Error number 28%') as 'err_28',filter(count(message), WHERE message like '%Errcode: 28%') as 'err_28',filter(count(message), WHERE message like '%OS errno 28%') as 'err_28',filter(count(message), WHERE message like '%error 28%') as 'err_28',filter(count(message), WHERE message like '%Error while writing%') as 'mysql_nospace',filter(count(message), WHERE message like '%rollback%') as 'rollback',filter(count(message), WHERE message like '%Foreign key constraint fails for table%') as 'foreign_key_constraint', filter(count(message)*100, WHERE message like '%Error_code: 1114%') as 'sql_1114_full',filter(count(message)*100, WHERE message like '%CRITICAL: SQLSTATE[HY000] [2006] MySQL server has gone away%') as 'sql_gone',  filter(count(message), WHERE message like '%SQLSTATE[HY000] [1040] Too many connections%') as 'sql_1040',  filter(count(message), WHERE message like '%CRITICAL: SQLSTATE[HY000] [2002]%') as 'sql_2002',  filter(count(message), WHERE message like '%SQLSTATE[08S01]:%') as 'sql_1047',  filter(count(message), WHERE message like '%[Warning] Aborted connection%') as 'aborted_conn',  filter(count(message), WHERE message like '%SQLSTATE[23000]: Integrity constraint violation:%') as 'sql_23000',  filter(count(message), WHERE message like '%1205 Lock wait timeout%') as 'sql_1205',  filter(count(message), WHERE message like '%SQLSTATE[HY000] [1049] Unknown database%') as 'sql_1049',  filter(count(message), WHERE message like '%SQLSTATE[42S02]: Base table or view not found:%') as 'sql_42S02',  filter(count(message)*100, WHERE message like '%General error: 1114%') as 'sql_1114' ,    filter(count(message), WHERE message like '%SQLSTATE[40001]%') as 'sql_1213',filter(count(message), WHERE message like '%SQLSTATE[42S22]: Column not found: 1054 Unknown column%') as 'sq1_1054' ,  filter(count(message), WHERE message like '%SQLSTATE[42000]: Syntax error or access violation:%') as 'sql_42000',  filter(count(message), WHERE message like '%SQLSTATE[21000]: Cardinality violation:%') as 'sql_1241', filter(count(message), WHERE message like '%SQLSTATE[22003]:%') as 'sql_22003' ,  filter(count(message), WHERE message like '%SQLSTATE[HY000] [9000] Client with IP address%') as 'sql_9000' ,  filter(count(message), WHERE message like '%SQLSTATE[HY000]: General error: 2014%') as 'sql_2014', filter(count(message), WHERE message like '%1927 Connection was killed%') as 'sql_1927',filter(count(message), WHERE message like '%1062 [ERROR] InnoDB:%') as 'sql_1062_e',filter(count(message), WHERE message like '%[Note] WSREP: Flushing memory map to disk...%') as 'mem_map_flush',filter(count(message), WHERE message like '%Internal MariaDB error code: 1146%') as 'sql_1146',filter(count(message), WHERE message like '%Internal MariaDB error code: 1062%') as 'sql_1062',filter(count(message), WHERE message like '%1062 [Warning] InnoDB:%') as 'sql_1062_w',filter(count(message), WHERE message like '%Internal MariaDB error code: 1064%') as 'sql_1064',filter(count(message)*10000, WHERE message like '%InnoDB: Assertion failure in file%') as 'assertion_err',filter(count(message)*100, WHERE message like '%mysqld_safe Number of processes running now: 0%') as 'mysql_oom',filter(count(message)*100, WHERE message like '%[ERROR] mysqld got signal%') as 'mysql_sigterm',filter(count(message), WHERE message like '%1452 Cannot add%') as 'sql_1452',filter(count(message), WHERE message like '%ERROR 1698%') as 'sql_1698',filter(count(message), WHERE message like '%SQLSTATE[HY000]: General error: 3%') as 'cnt_wrt_tmp',filter(count(message), WHERE message like '%General error: 1 %') as 'sql_syntax',filter(count(message), WHERE message like '%42S22%') as 'sql_42S22' ,filter(count(message), WHERE message like '%InnoDB: Error (Duplicate key)%') as 'innodb_dup_key',filter(count(message), WHERE message like '%mysqld: Disk full%') as 'disk_full',filter(count(message), WHERE message like '%1021 Disk full%') as 'mysql_nospace',filter(count(message), WHERE message like '%ERROR 1021 (HY000): Database out of space%') as 'mysql_nospace',filter(count(message), WHERE message like '%SQLSTATE[HY000] [1021] Database out of space%') as 'mysql_nospace',filter(count(message), WHERE message like '%1021 Database out of space%') as 'mysql_nospace',filter(count(message), WHERE message like '%Database out of space%') as 'mysql_nospace',filter(count(message), WHERE message like '%SQLSTATE[HY000] [1021] Database out of space%') as 'mysql_nospace',filter(count(message), WHERE message like '%SQLSTATE[HY000] [1021] Database out of space%') as 'mysql_nospace',filter(count(message), WHERE message like '%SQLSTATE[HY000] [1021] Database out of space%') as 'mysql_nospace',filter(count(message), WHERE message like '%/var/log: Input/output error%') as 'mysql_nospace',filter(count(message), WHERE message like '%error: 1021%') as 'mysql_nospace',filter(count(message), WHERE message like '%Error 1021%') as 'mysql_nospace',filter(count(message), WHERE message like '%Disk full (/tmp') as 'tmp_nospace',filter(count(message), WHERE message like '%tmp is full%') as 'tmp_nospace',filter(count(message), WHERE message like '%SQLSTATE[HY000] [1021] Database out of space%') as 'mysql_nospace',filter(count(message), WHERE message like '%errno=28 No space left on device%') as 'mysql_nospace',filter(count(message), WHERE message like '%MySQL went away%') as 'mysql_went_away',filter(count(message), WHERE message like '%1047 WSREP has not yet prepared node for application use Import error%') as 'mysql_not_prepared',filter(count(message), WHERE message like '%General error: 1180 Got error 5%') as 'mysql_nospace',filter(count(message), WHERE message like '%SInnoDB: Error (Out of disk space) writing word node%') as 'mysql_nospace',filter(count(message), WHERE message like '%1114 The table%') as 'mysql_nospace',filter(count(message), WHERE message like '%General error: 3 Error writing file%') as 'mysql_nospace',filter(count(message), WHERE message like '%SQLSTATE[HY000] [1021] Database out of space%') as 'mysql_nospace',filter(count(message), WHERE message like '%SQLSTATE[HY000] [1021] Database out of space%') as 'mysql_nospace',filter(count(message), WHERE message like '%SQLSTATE[HY000] [1021] Database out of space%') as 'mysql_nospace',filter(count(message), WHERE message like '%mysqld: Disk full%') as 'disk_full',filter(count(message), WHERE message like '%CRITICAL: SQLSTATE[HY000] [2002] Connection timed out%') as 'sql_2002',filter(count(message), WHERE message like '%ERROR 1452%') as 'sql_1452',filter(count(message), WHERE message like '%SQLSTATE[HY000] [2002] Connection refused%') as 'sql_2002',filter(count(message), WHERE message like '%General error: 14 Can%t change size of file%') as 'mysql_nospace' FROM Log limit max facet apmApplicationNames `
        const slowMySQL = `SELECT filter(count(message), WHERE message like '%update%') as 'update',  filter(count(message), WHERE message like '%insert%') as 'insert',  filter(count(message), WHERE message like '%delete%') as 'delete',  filter(count(message), WHERE message like '%commit%') as 'commit',  filter(count(message), WHERE message like '%commit%') as 'commit',filter(count(message), WHERE message like '%select%') as 'select' FROM Log TIMESERIES WHERE ident='mysql-slow.log' OR filePath like '%mysql-slow.log%'  `
        const SQLTrace = `FROM SqlTrace  select count(*)  facet databaseMetricName timeseries  `
        const phpErrs = `SELECT  filter(count(message), WHERE message like '%worker_connections are not enough%') as 'worker' ,  filter((count(message)*5), WHERE message like '%PHP Fatal error:  Allowed memory size!%') as 'mem_size' , filter(count(message), WHERE message like '%exited on signal 11 (SIGSEGV)%') as 'sig_11'  ,  filter(count(message), WHERE message like '%exited on signal 7 (SIGBUS)%') as 'sig_7'  ,  filter(count(message), WHERE message like '%increase pm.start_servers%') as 'pmstart_serv' ,  filter(count(message), WHERE message like '%max_children%') as 'max_children_cnt',  filter((count(message)*5), WHERE message like '%PHP Fatal error:  Allowed memory size of%') as 'mem_exhst_coun',  filter((count(message)*3), WHERE message like '%Unable to allocate memory for pool%') as 'opc_mem_count',  filter(count(message), WHERE message like '%Warning Interned string buffer overflow%') as 'opc_str_buf',  filter(count(message), WHERE message like '%Illegal string offsetl%') as 'opc_sv_comments',  filter(count(message), WHERE message like '%PHP Fatal error:  Uncaught RedisException: read error on connection%') as 'php_exc'  FROM Log facet hostname TIMESERIES `
        /*const redisThresh = `SELECT 100*average(system.usedMemoryBytes)/average(system.maxmemoryBytes) as RedisMemoryPercent FROM RedisSample timeseries   `*/
        const redisThresh = `SELECT 100*max(used_memory)/average(maxmemory) as RedisMemoryPercent FROM FlexRedisMemorySample FACET apmApplicationNames,hostname timeseries `
        const redisUsedMem = `SELECT average(system.usedMemoryBytes) as 'Used memory' FROM RedisSample TIMESERIES FACET apmApplicationNames,entityName   `
        const redisChngLstSv = `SELECT average(db.rdbChangesSinceLastSave) AS 'Rdb changes' FROM RedisSample TIMESERIES FACET apmApplicationNames,entityName  `
        const dbReqs = `SELECT average(query.comInsertPerSecond) * uniqueCount(entityName) as 'Insert Commands', average(query.comSelectPerSecond) * uniqueCount(entityName) as 'Select Commands', average(query.comUpdatePerSecond) * uniqueCount(entityName) as 'Update Comands', average(query.comDeletePerSecond) * uniqueCount(entityName) as 'Delete Commands' FROM MysqlSample TIMESERIES  `
        const mySQLmem = `SELECT average(memoryResidentSizeBytes) FROM ProcessSample FACET apmApplicationNames,hostname WHERE processDisplayName = 'mysql'   TIMESERIES `
        const cronErr = `SELECT filter(count(message), WHERE message like '%_stg%') as 'stg_crons',filter(count(message), WHERE message like '%Could not acquire lock for cron job%') as 'cron_lock',filter(count(message)*10, WHERE message like '%General error: 2006 MySQL server has gone away%') as 'mysql_has_gone_away',filter(count(message), WHERE message like '%error%') as 'error',filter(count(message), WHERE message like '%General error: 1205 Lock wait timeout exceeded%' ) as sql_1205_cron FROM Log WHERE filePath like '%cron%' timeseries `
        const process_reaped = ` SELECT filter(count(message),WHERE message like '%oom_reaper: reaped process%') as total_reaped, filter(count(message), WHERE message like '%(php), now anon-rss:%') as php_reaped FROM Log  timeseries `
        const redisConn = `SELECT average(net.connectedClients) as 'Connected clients' FROM RedisSample FACET apmApplicationNames,entityName  TIMESERIES `
        const redisNodes = `SELECT filter(uniqueCount(entityName), WHERE cluster.role = 'master') AS 'Primary', filter(uniqueCount(entityName), WHERE cluster.role = 'slave') AS 'Secondary' FROM RedisSample TIMESERIES facet apmApplicationNames  `
        const dbHealth = `SELECT filter(count(db.handlerWritePerSecond), where db.handlerWritePerSecond >0 )  as 'WritePerSecond',  filter(count(db.handlerUpdatePerSecond), WHERE db.handlerUpdatePerSecond >0) as 'UpdatePerSecond',  filter(count(db.innodb.rowsReadPerSecond), WHERE db.innodb.rowsReadPerSecond >0) as 'rowReadPerSec',  filter(count(query.slowQueriesPerSecond), WHERE query.slowQueriesPerSecond >0) as 'slowQueryPerSec' FROM MysqlSample TIMESERIES  `
        const dbNode = `SELECT entityName,software.version,label.role,apmApplicationNames,instanceType FROM MysqlSample   `
        const dbConns = `SELECT latest(net.threadsConnected) as 'Active Connections' FROM MysqlSample  facet entityName, apmApplicationNames TIMESERIES  `
        const dbConnsRunning = `SELECT latest(net.threadsRunning) as 'NonSleeping_Connections' FROM MysqlSample  facet entityName, apmApplicationNames TIMESERIES `
        const dbConnsRunningSleeping = `SELECT latest(net.threadsRunning) as 'NonSleeping_Connections',(latest(net.threadsConnected)-latest(net.threadsRunning)) as 'sleeping_connections' FROM MysqlSample  facet apmApplicationNames TIMESERIES `
        const redisBill = `SELECT filter(uniqueCount(entityName), WHERE cluster.role = 'master') as 'Primaries', filter(uniqueCount(entityName), WHERE cluster.role = 'slave') as 'Secondaries' FROM RedisSample  `
        const alertOpen = `SELECT count(*) from NrAiIncident facet conditionName, tag.hostname where event like '%open%' and priority  like '%critical%' limit 2000 `
        const alertClose = `SELECT count(*) from NrAiIncident facet conditionName, tag.hostname where event like '%close%' and priority  like '%critical%' limit 2000 `
        const alertRecentDetails =`SELECT conditionName,event,openTime,priority,runbookUrl,tag.hostname,title,closeCause,closeTime,durationSeconds from NrAiIncident where priority  like '%critical%' limit 2000 `
        const wafSummary = `SELECT filter(Count(waf_block), WHERE waf_block = '1') as 'Blocked',filter(Count(waf_passed), WHERE waf_passed = '1') as 'Passed',filter(Count(waf_logged), WHERE waf_logged = 1) as 'Logged',filter(Count(waf_failures), WHERE waf_failures = '1') as 'Failed'  FROM Log  where ident is null timeseries `
        const wafBlockedIP = `SELECT filter(count('client_ip'), where waf_block ='1') as blocked_ip FROM Log WHERE ident is  null    facet client_ip  limit 10 `
        const wafLoggedIP = ` SELECT filter(count('client_ip'), where waf_logged ='1') as logged_ip FROM Log WHERE ident is  null    facet client_ip  limit 10    `
        const wafLoggedDetail = `SELECT time_start,ip_map, geo_city, geo_country_code,geo_datacenter, geo_region, request_accept_encoding, request_user_agent, url, request_referer, origin_host,waf_anomaly_score, waf_logged, waf_message, reqstatus FROM Log  where ident is null and waf_logged = '1' limit 1000 `
        const wafBlockedDetail = `SELECT time_start,ip_map, geo_city, geo_country_code,geo_datacenter, geo_region, request_accept_encoding, request_user_agent, url, request_referer, origin_host,waf_anomaly_score, waf_logged, waf_message, reqstatus FROM Log   where ident is null and waf_block = '1' limit 1000 `
        const alertInfra = `SELECT agentName,hostname,apmApplicationNames, category, changeType, changedPath, oldValue, newValue, instanceType,source,summary  from InfrastructureEvent  WHERE apmApplicationNames not like '%staging%' limit 2000 `
        const serviceAlertInfa = `SELECT count(*) from InfrastructureEvent  limit max where summary like '%service%' and summary not like '%Response [error]%' timeseries facet summary,apmApplicationNames  `
        const wafRuleSummary = ``
        const wafRuleDetail = `SELECT time_start,waf_rule_id, ip_map, geo_city, geo_country_code,geo_datacenter, geo_region, request_accept_encoding, request_user_agent, url, request_referer, origin_host,waf_anomaly_score, reqstatus FROM Log  SINCE 7 days AGO where ident is null and waf_executed = '1' limit 1000 `
        const wafRuleLoggedExecutedCount= `select Count(waf_rule_id)  FROM Log WHERE ident is  null and waf_executed = '1' and waf_logged = '1'  facet waf_rule_id, client_ip    limit 10`
        const wafBlockedCountry =`SELECT filter(count(geo_country_code), where waf_block ='1') as country FROM Log WHERE ident is  null    facet geo_country_code  limit 10 `
        const hostLogCount = `SELECT log2(log10(count(message))) FROM Log FACET fb.input, hostname timeseries `
        const LogCountsbyHost = `SELECT count(message) FROM Log FACET ident, hostname timeseries `
        const vCPUcountDay = `select sum(processorCount) FROM (  SELECT max(numeric(processorCount)) as processorCount FROM SystemSample facet entityName,apmApplicationNames timeseries 1 day limit 20 ) facet apmApplicationNames timeseries 1 day `
        const vCPUcount = `select sum(processorCount) FROM (  SELECT max(numeric(processorCount)) as processorCount FROM SystemSample facet entityName,apmApplicationNames timeseries 1 hours limit 20 ) facet apmApplicationNames timeseries 1 hours  `
        const vCPUCountNode = `select sum(processorCount) FROM (  SELECT max(numeric(processorCount)) as processorCount FROM SystemSample facet entityName,apmApplicationNames timeseries 15 minutes limit 20 ) facet apmApplicationNames,entityName timeseries 15 minutes extrapolate limit max `
        const instanceType = `SELECT entityName,apmApplicationNames, instanceType, diskTotalBytes/1024/1024/1024 as disk_gb, memoryTotalBytes/1024/1024/1024 as mem_gb, processorCount   FROM SystemSample limit 2000 `
        const sessionCount = `SELECT uniqueCount(session) FROM PageView TIMESERIES`
        const indexCatalogsearch = `SELECT  average(apm.service.datastore.operation.duration) FROM Metric FACET table WHERE appName LIKE '%' and table like '%catalogsearch%' TIMESERIES limit 15 `
        const indexProduct = `SELECT  average(apm.service.datastore.operation.duration) FROM Metric FACET table WHERE appName LIKE '%' and table like '%product%' TIMESERIES limit 15 `
        const indexRebuild = `FROM Log SELECT filter(count(message), WHERE message like '%Catalog Product Rule index has been rebuilt%') as 'catalog_product_rule_idx',  filter(count(message), WHERE message like '%Catalog Rule Product index has been rebuilt%') as 'catalog_rule_product_idx',  filter(count(message), WHERE message like '%Catalog Search index has been rebuilt%') as 'catalog_search_idx',  filter(count(message), WHERE message like '%Category Products index has been rebuilt successfully%') as 'category_products_idx',  filter(count(message), WHERE message like '%Customer Grid index has been rebuilt%') as 'customer_grid_idx',  filter(count(message), WHERE message like '%Design Config Grid index has been rebuilt%') as 'design_config_grid_idx' ,  filter(count(message), WHERE message like '%Product Categories index has been rebuilt%') as 'product_categories_idx',  filter(count(message), WHERE message like '%Product EAV index has been rebuilt%') as 'product_eav_idx',  filter(count(message), WHERE message like '%Product Price index has been rebuilt%') as 'product_price_idx',  filter(count(message), WHERE message like '%Stock index has been rebuilt%') as 'stock_idx',  filter(count(message), WHERE message like '%Inventory index has been rebuilt successfully%') as 'inventory_idx',  filter(count(message), WHERE message like '%Product/Target Rule index has been rebuilt successfully%') as 'prod_target_rule_idx',  filter(count(message), WHERE message like '%Sales Rule index has been rebuilt successfully%') as 'sales_rule_idx'   timeseries `
        const indexInvalidated = `FROM Log SELECT filter(count(message), WHERE message like '%Catalog Product Rule indexer has been invalidated%') as 'catalog_product_rule_idx_reset',  filter(count(message), WHERE message like '%Catalog Rule Product indexer has been invalidated%') as 'catalog_rule_product_idx_reset',  filter(count(message), WHERE message like '%Catalog Search indexer has been invalidated%') as 'catalog_search_idx_reset',  filter(count(message), WHERE message like '%Category Products indexer has been invalidated%') as 'category_products_idx_reset',  filter(count(message), WHERE message like '%Customer Grid indexer has been invalidated%') as 'customer_grid_idx_reset',  filter(count(message), WHERE message like '%Design Config Grid indexer has been invalidated%') as 'design_config_grid_idx_reset' ,  filter(count(message), WHERE message like '%Product Categories indexer has been invalidated%') as 'product_categories_idx_reset',  filter(count(message), WHERE message like '%Product EAV indexer has been invalidated%') as 'product_eav_idx_reset',  filter(count(message), WHERE message like '%Product Price indexer has been invalidated%') as 'product_price_idx_reset',  filter(count(message), WHERE message like '%Stock indexer has been invalidated%') as 'stock_idx_reset',  filter(count(message), WHERE message like '%Inventory indexer has been invalidated%') as 'inventory_idx_reset',  filter(count(message), WHERE message like '%Product/Target Rule indexer has been invalidated%') as 'prod_target_rule_idx_reset',  filter(count(message), WHERE message like '%Sales Rule indexer has been invalidated%') as 'sales_rule_idx_reset' timeseries auto `
        const cacheFlush = `FROM Log SELECT filter(count(message), WHERE message like '%config%') as 'config_cache_flushed',  filter(count(message), WHERE message like '%layout%') as 'layout_cache_flush',  filter(count(message), WHERE message like '%block_html%') as 'block_html_cache_flush',  filter(count(message), WHERE message like '%collections%') as 'collections_cache_flush',  filter(count(message), WHERE message like '%reflection%') as 'reflection_cache_flush',  filter(count(message), WHERE message like '%db_ddl%') as 'db_ddl_cache_flush' ,  filter(count(message), WHERE message like '%compiled_config%') as 'compiled_config_cache_flush',  filter(count(message), WHERE message like '%eav%') as 'eav_cache_flush',  filter(count(message), WHERE message like '%customer_notification%') as 'cust_notif_cache_flush',  filter(count(message), WHERE message like '%config_integration%') as 'config_integ_cache_flush',  filter(count(message), WHERE message like '%config_integration_api%') as 'config_integ_api_cache_flush',  filter(count(message), WHERE message like '%full_page%') as 'full_page_cache_flush',  filter(count(message), WHERE message like '%config_webservice%') as 'config_webserv_cache_flush',  filter(count(message), WHERE message like '%translate%') as 'translate_cache_flush' WHERE filePath like '%post_deploy%' OR filePath like '%cache.log%' timeseries auto facet filePath `
        const cron_sched_cleaned_details = `FROM Log select dateOf(timestamp), cluster, message WHERE message like '%cron jobs were cleaned%' and cluster not like '%.dev%' AND filePath like '%cron.log%' limit 2000`
        const cron_sched_cleaned_completed = `FROM Log SELECT filter(count(message), WHERE message like '%cron jobs were cleaned%') as 'cron_jobs_cleaned' WHERE  cluster not like '%.dev%' AND filePath like '%cron.log%' TIMESERIES limit max `
        const cron_schedule_graph = `SELECT  max(apm.service.datastore.operation.duration) FROM Metric FACET table WHERE appName LIKE '%' and table like '%cron%' TIMESERIES `
        const cron_trans = `FROM Transaction select max(duration)  where transactionType like 'Other'  timeseries  limit max facet transactionType,name `
        const infra_inode_pct = `FROM StorageSample select max(inodesUsedPercent) facet hostname,mountPoint   timeseries auto limit 100 `
        const database_call_count = `FROM Transaction select max(databaseCallCount)  timeseries  limit max  facet name `
        const database_call_count_cron = `FROM Transaction select max(databaseCallCount)  timeseries  limit max  facet name where transactionType ='Other' `
        const sqltrace = `SELECT count(*) FROM SqlTrace  timeseries facet path `
        const apiRest = `SELECT count(*) from Log where url like '%/rest%'  facet client_ip timeseries `
        const apiRestDetail = `SELECT count(*) from Log where url like '%/rest%'  facet client_ip,url timeseries  limit 150 `
        const  apiRestDetailForgotPW = `SELECT count(*) from Log where url like '%account/forgotpassword%'  facet client_ip,url timeseries  limit 25 `
        const apiRestDetailCreateAccount = `SELECT count(*) from Log where url like '%/customer/account/create%' facet client_ip,url timeseries limit 50 `
        const apiRestDetailPOST = `SELECT count(*) from Log where client_ip is not null and request like 'POST' facet client_ip,url timeseries  `
        const apiRestDetailPOSTtable = `SELECT * from Log where client_ip is not null and request like 'POST' limit max  `
        const apiRestDetailPOSTsummary = `SELECT count(*) from Log where client_ip is not null and request like 'POST' facet client_ip,url limit max `
        const apiRestDetailGuestCarts = `SELECT count(*) from Log where url like '%V1/guest-carts%' facet client_ip,url timeseries limit 50 `
        const apiRestDetailCountries = `FROM Log SELECT count ('client_ip')  WHERE 'client_ip' IS NOT NULL and cache_status in ('PASS','MISS')  FACET url,geo_country_code LIMIT max  WHERE url like '%customer/account/create%' OR url like '%forgotpassword%' `
        const apiRestDetailIP = `FROM Log SELECT count ('client_ip')  WHERE 'client_ip' IS NOT NULL and cache_status in ('PASS','MISS')  FACET client_ip,url,geo_country_code LIMIT max WHERE url like '%customer/account/create%' OR url like '%forgotpassword%'`
        const dbPerf = `SELECT average(query.queriesPerSecond), average(query.slowQueriesPerSecond),average(db.createdTmpDiskTablesPerSecond), average(db.createdTmpFilesPerSecond),average(db.tablesLocksWaitedPerSecond),average(db.innodb.rowLockTimeAvg),average(db.innodb.rowLockWaitsPerSecond) FROM MysqlSample timeseries `
        const apiRestDetailGuestCartsCount = `SELECT count(*) from Log where url like '%V1/guest-carts%' facet client_ip,url  limit max `
        const apiRestDetailGuestCartsCountries = `SELECT count(*) from Log where url like '%V1/guest-carts%' facet geo_country_code,url,client_ip  limit max `
        const webTraffic = `SELECT count(*) as 'Num_of_requests' FROM Transaction   TIMESERIES AUTO  compare with 1 week ago `
        //const apdex500 = `SELECT filter(count(httpResponseCode),where numeric(httpResponseCode) >=499 ) as 'err_500', percentage(count(*), WHERE duration <= 2) AS '% Satisfied',  percentage(count(*), WHERE duration <=4 and duration >2) AS '% Tolerating',  percentage(count(*), WHERE duration >4 ) AS '% Frustrated' FROM Transaction timeseries `
        // const apdex500 = `SELECT filter(log10(count(httpResponseCode)),where numeric(httpResponseCode) >=499 ) , percentage(count(*), WHERE duration <= 2) AS '% Satisfied',  percentage(count(*), WHERE duration <=4 and duration >2) AS '% Tolerating',  percentage(count(*), WHERE duration >4 ) AS '% Frustrated' FROM Transaction timeseries `
        //const apdex500 = `SELECT apdex(duration, t:2) as apdex, percentage(count(*), WHERE duration <=4 and duration >2) +  percentage(count(*), WHERE duration >4 ) + filter(log10(log2(count(httpResponseCode))),where numeric(httpResponseCode) >=499) as mod_apdex, filter(count(httpResponseCode),where numeric(httpResponseCode) >=499) as '500_err' FROM Transaction  timeseries WHERE transactionSubType='Action' AND transactionType='Web' AND response.headers.contentType='text/html' `
        const apdex500 = `SELECT apdex(duration, t: 2) AS apdex, percentage(count(*), WHERE duration <=4 and duration >2) +  percentage(count(*), WHERE duration >4 ) + filter(log10(log2(count(httpResponseCode))),where numeric(httpResponseCode) >=400) as mod_apdex, filter(count(httpResponseCode),where numeric(httpResponseCode) >=400) as 'err' FROM Transaction  timeseries    WHERE transactionSubType='Action' AND transactionType='Web' AND response.headers.contentType='text/html' `
        /*const nerdlet = {         urlState: {              accountId: this.accountId,        },    };*/
        const cdnRequests = `FROM Log SELECT count(request) AS 'Request Count', filter(count(request), WHERE status != 200) AS 'Error Count' WHERE filePath IS  NULL  COMPARE WITH 1 WEEK AGO `
        const cdnTotalBandwidth = `FROM Log SELECT sum(numeric(resp_header_size)+numeric(resp_body_size))/1000 AS 'Total MB', rate(sum(numeric(resp_header_size)+numeric(resp_body_size))/1000*8, 1 minute) AS 'Total MBps per minute'  COMPARE WITH 1 WEEK AGO `
        const cdnTotalBandwidthByPop = `FROM Log SELECT sum(numeric(resp_header_size)+numeric(resp_body_size))/1000 AS 'Total MB', rate(sum(numeric(resp_header_size)+numeric(resp_body_size))/1000*8, 1 minute) AS 'Total MBps'  COMPARE WITH 1 WEEK AGO ORDER BY 'Total MB' facet geo_datacenter `
        const cdnTotalErrorByPop = `FROM Log SELECT count(*) where filePath is NULL AND numeric(status) > 400 and numeric(status) <600  facet status,geo_datacenter timeseries limit 50 `
        const cdnResponseStatus = `FROM Log SELECT count(*) WHERE filePath IS  NULL FACET status `
        const cdnTop5_5xx3xx = `FROM Log SELECT count(url) AS 'Url Count' WHERE filePath IS  NULL AND status like '5%' OR status like '3%' FACET url,status LIMIT 5 `
        const cdnTop5_2xx = `FROM Log SELECT count(url) AS 'Url Count' WHERE filePath is NULL AND status LIKE '200'  FACET url LIMIT 10 `
        const cdnDurationByResponseStatus = `FROM Log SELECT average(numeric(time_elapsed))/1000000  AS 'Avg. Duration (ms)', percentile(numeric(time_elapsed),95)/1000 AS '95th Pct. Duration (ms)' WHERE filePath is NULL  TIMESERIES LIMIT MAX facet status `
        const cdnDurationByResponseStatusURLtop25 = `FROM Log SELECT average(numeric(time_elapsed))/1000000  AS 'Avg. Duration (ms)', percentile(numeric(time_elapsed),95)/1000 AS '95th Pct. Duration (ms)' WHERE filePath is NULL  TIMESERIES LIMIT 25 facet status,url `
        const cdnDurationByResponseStatusURLtop25non200 = `FROM Log SELECT average(numeric(time_elapsed))/1000000  AS 'Avg. Duration (ms)', percentile(numeric(time_elapsed),95)/1000 AS '95th Pct. Duration (ms)' WHERE filePath is NULL  TIMESERIES LIMIT 25 facet status,url where status != '200' `
        const cdnDurationByResponseStatusClienIPtop25non200 = `FROM Log SELECT average(numeric(time_elapsed))/1000000  AS 'Avg. Duration (ms)', percentile(numeric(time_elapsed),95)/1000 AS '95th Pct. Duration (ms)' WHERE filePath is NULL  TIMESERIES LIMIT 25 facet client_ip,status where status != '200' `
        const cdnHitCount = `SELECT count(cache_status) FROM Log  where is_cacheable like 'true' AND cache_status like 'HIT' OR cache_status like 'MISS' facet cache_status `
        const cdnHitPercentage = `FROM Log SELECT filter(count(cache_status),where cache_status  like 'HIT') / count(*)*100 as 'HIT %'  where is_cacheable like 'true' compare with 1 week ago `
        const cdnHitRate = `SELECT rate(count(cache_status),1 minutes) as 'HITS per min'  FROM Log  where is_cacheable like 'true' AND cache_status like 'HIT'  compare with 1 week ago `
        const cdnHitProcTime = `SELECT (average(numeric(time_elapsed))/1000000 ) as'seconds' FROM Log  where is_cacheable like 'true' AND cache_status like 'HIT' compare with 1 week ago `
        const cdnMissRate = `SELECT rate(count(cache_status),1 minutes) as 'MISS per min'  FROM Log  where is_cacheable like 'true' AND cache_status like 'MISS' compare with 1 week ago `
        const cdnMissProcTime = `SELECT (average(numeric(time_elapsed)) / 1000000 ) as'seconds' FROM Log  where is_cacheable like 'true' AND cache_status like 'MISS' compare with 1 week ago `
        const cdnReqRate = `SELECT rate(count(cache_status),1 minutes) as 'Request during timeframe'  FROM Log  where is_cacheable like 'true'  compare with 1 week ago `
        const cdnErrRate = `SELECT rate(count(cache_status),1 minutes) as 'Error per min'  FROM Log  where  cache_status like 'ERROR'  compare with 1 week ago `
        const cdnOriginLatency = `SELECT (average(numeric(time_elapsed)) / 1000000 ) as'seconds' FROM Log  where  cache_status like 'MISS' and is_cacheable like 'true' compare with 1 week ago timeseries `
        const cdnCdnlatency = `SELECT (average(numeric(time_elapsed)) / 1000000 ) as'seconds' FROM Log  where  cache_status like 'HIT' and is_cacheable like 'true' compare with 1 week ago timeseries `
        const cdnErrorPercentage = `FROM Log SELECT (filter(count(cache_status),where cache_status  like 'ERROR') / count(*))*100 as 'ERROR %'   compare with 1 week ago `
        /*nerdlet.setUrlState({        accountId: this.accountId      });*/
        /*nerdlet.setUrlState({
           accountId: this.state.accountId,
           foo: 'bar',
           fizz: 'buzz',
           cool: true,
           number: 1,

        });
        nerdlet.setUrlState({        accountId: this.state.accountId });*/

        return (






            (<Tabs>
                <TabsItem label={`Summary`} value={1}>

                    <Stack

                        fullWidth
                        horizontalType={Stack.HORIZONTAL_TYPE.FILL_EVENLY}
                        gapType={Stack.GAP_TYPE.EXTRA_LOOSE}
                        spacingType={[Stack.SPACING_TYPE.MEDIUM]}
                        directionType={Stack.DIRECTION_TYPE.VERTICAL}>

                        <StackItem>
                            <AccountPicker
                                //value = {NerdletState.accountId}
                                //{ console.log('AccountPicker value=',value) }

                                value={this.state.accountId}

                                //value = {nerdlet.accountId}
                                onChange={this.onChangeAccount}
                            />
                        </StackItem>

                        {accounts && (
                            <StackItem>

                                <Select value={selectedAccount}  onChange={(evt, value) => this.selectAccount(value) } >

                                    {accounts.map((a) => {

                                        return (
                                            <SelectItem key={a.id} value={a}>
                                                {a.name}
                                            </SelectItem>
                                        )
                                    })}
                                </Select>
                            </StackItem>
                        )
                        }

                        <StackItem>
                            <hr />

                            <PlatformStateContext.Consumer>
                                {(PlatformState) => {
                                    /* Taking a peek at the PlatformState */
                                    console.log('Entered PlatformStateContext Summary tab...')
                                    const since = timeRangeToNrql(PlatformState);
                                    return (
                                        <>
                                            <Grid
                                                className="primary-grid"
                                                spacingType={[Grid.SPACING_TYPE.NONE, Grid.SPACING_TYPE.NONE]}
                                            >
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.SMALL]} type={HeadingText.TYPE.HEADING_3} style={{ color: 'red' }} >
                                                            <strong>  NOTE: If many of the resource frames below are blank, New Relic Infrastructure may not have been enabled for this account!</strong>
                                                        </HeadingText>
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={6}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong> Transaction Overview</strong>
                                                        </HeadingText>
                                                        <TableChart fullWidth accountId={accountId} query={trxOverview+since} className="table"  />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={6}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>404 page errors</strong>
                                                        </HeadingText>
                                                        <TableChart fullWidth accountId={accountId} query={page404+since} className="table" />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={3}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong> % of Storage Free</strong>  <Link to="https://devdocs.cmdb.com/cloud/project/manage-disk-space.html">   Manage Storage </Link>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={storFree+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={3}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong> % of system memory that is free</strong>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={memFree+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={3}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>% Swap memory free</strong>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={swapFreePer+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={3}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4} >
                                                            <strong>CPU % by host </strong><Link to="https://wiki.cmdb.com/hc/en-us/articles/360042149832#high_cpu_usage">   High CPU Utilization </Link>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={cpuHost+since} />

                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>Alerts during timeframe</strong> <Link to="https://wiki.cmdb.com/hc/en-us/articles/360045806832"> Magento Managed Alerts Information</Link>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={alertTimeLine+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}  >
                                                            <strong>CPU Usage ---- IF THIS FRAME IS BLANK (along with many other frames), NR INFRASTRUCTURE MAY NOT BE ENABLED)</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={cpuUsage+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>Average Response Time (milliseconds)</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={avgResTime+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>Apdex (T=2) timeline with 500 codes</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={apdex500+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>Long duration cron_schedule updates</strong>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={cron_schedule_graph+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>Response Code</strong>    <Link to="https://wiki.cmdb.com/hc/en-us/articles/360029351531"> Site Down? Try This...</Link>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={responseCodes+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>Web Traffic volume compared with one week ago</strong> <Link to="https://wiki.cmdb.com/hc/en-us/articles/360045806832"> Magento Managed Alerts Information</Link>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={webTraffic+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>Deployment Log Entries</strong><Link to="https://wiki.cmdb.com/hc/en-us/articles/360040986912-Deployment-troubleshooter"> Deployment Troubleshooter</Link>

                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={deployLog+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>Deployment State</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={deployState+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>   IP Frequency </strong>   <Link to="https://wiki.cmdb.com/hc/en-us/articles/360039447892">   How to block malicious traffic on Fastly level </Link>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={ipFreq+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>   IP Response - top 20 URLs in duration </strong>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={ipResponse+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>API calls by IP </strong>   <Link to="https://wiki.cmdb.com/hc/en-us/articles/360039447892">   How to block malicious traffic on Fastly level </Link>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={apiRest+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>API calls by IP, details by URL </strong>   <Link to="https://wiki.cmdb.com/hc/en-us/articles/360039447892">   How to block malicious traffic on Fastly level </Link>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={apiRestDetail+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>   IP Frequency Rate per minute</strong>   <Link to="https://wiki.cmdb.com/hc/en-us/articles/360039447892">   How to block malicious traffic on Fastly level </Link>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={ipRate+since} />
                                                    </main>
                                                </GridItem>

                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>   Potential Bots </strong>  <Link to="https://wiki.cmdb.com/hc/en-us/articles/360048754931"> Best practices for Magento robots.txt </Link>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={potBot+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>  Transaction Errors </strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={errCount+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong> nginx access by node </strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={nginxStatus+since} />
                                                    </main>

                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>  Galera Log </strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={galeraLog+since} />
                                                    </main>
                                                </GridItem>

                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>  Database Errors</strong>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={dbErrors1+since} />
                                                    </main>
                                                </GridItem>

                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>   Database traces</strong>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={dbTrace+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>  Database mysql-slow.log </strong>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={slowMySQL+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong> Redis synchronization from Log </strong>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={redisLog+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>  PHP process states </strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={phpLog+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>PHP errors </strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={phpErrs+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong> PHP processes</strong>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={phpProc+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>Secondary processes</strong>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={secProc+since} />
                                                    </main>
                                                </GridItem>

                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>   Traffic vs Week Ago</strong>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={trafvWeek+since} />
                                                    </main>
                                                </GridItem>

                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>   Fastly Cache </strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={fastlyCache+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>  Page Rendering (Average)</strong>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={pageRend+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>  Page loading detail</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={paintLoad+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>Transactions - Avg, Max, Min</strong>
                                                        </HeadingText>
                                                        <TableChart fullWidth accountId={accountId} query={transAvgMaxMin+since} className="table" />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>Admin Activities</strong>
                                                        </HeadingText>
                                                        <TableChart fullWidth accountId={accountId} query={AdminAct+since} className="table"/>
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>Order transactions (default?)</strong>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={ordersTran+since} />
                                                    </main>
                                                </GridItem>


                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>ElasticSearch Index information</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={elastic+since} />
                                                    </main>
                                                </GridItem>

                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>ElasticSearch Errors</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={elasticErr+since} />
                                                    </main>
                                                </GridItem>

                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>Cron view</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={cronJob+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>Cron error</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={cronErr+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong> Cron schedule table updates</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={datastoreOpsCron+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>Datastore Operations Tables - top 10 operations by tablename, this graph may not load if the timeline is greater than 3 days</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={datastoreOpsTable+since}  />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>Cache Flush</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={cacheFlush+since} />
                                                    </main>
                                                </GridItem>
                                            </Grid>


                                        </>
                                    );
                                }}
                            </PlatformStateContext.Consumer>

                        </StackItem>
                    </Stack>
                    <NerdletStateContext.Consumer>
                        {(nerdletState) => {

                            nerdletState.accountId;
                            nerdletState.selectedAccount;
                            if (this.state.accountId == undefined && this.state.selectedAccount == undefined) {
                                console.log('Inside NerdletStateContext if statement')
                                console.log('Nerdlet State AccountId:', nerdletState);
                                console.log('Nerdlet State SelectedAccount: ', nerdletState.selectedAccount);
                                console.log('this state accountId init: ',this.state.accountId);
                                console.log('this state selectedAccount init: ',this.state.selectedAccount);
                                this.state.accountId=nerdletState.accountId;
                                this.state.selectedAccount=nerdletState.selectedAccount;
                                console.log('updated this state:', this.state.accountId);
                                console.log('updated this state selectedAccount...', this.state.selectedAccount)}
                            //selectedAccount = nerdletState.selectedAccount;
                            //accountId = nerdletState.accountId;
                            //console.log('this.state.selectedAccount =',this.state.selectedAccount)
                            //console.log('this.state.accountId =',this.state.accountId)
                            console.log('Nerdlet State AccountId:', nerdletState);
                            console.log('Nerdlet State SelectedAccount: ', nerdletState.selectedAccount);
                            console.log('')


                        }}
                    </NerdletStateContext.Consumer>

                    <PlatformStateContext.Consumer>
                        {(platformUrlState) => {
                            //console.debug here for learning purposes
                            //platformUrlState.accountId = this.state.accountId;
                            //console.log('platformURLState: ',platformUrlState); //eslint-disable-line
                            const { duration } = platformUrlState.timeRange;

                            //const {account} = platformUrlState.accountId;
                            //platformUrlState.account = this.state.accountId;
                            const since = ` SINCE ${duration/60/1000} MINUTES AGO`;


                        }}
                    </PlatformStateContext.Consumer>
                </TabsItem>

                <TabsItem label={`ElasticSearch`} value={2}>
                    <Stack
                        fullWidth
                        horizontalType={Stack.HORIZONTAL_TYPE.FILL}
                        directionType={Stack.DIRECTION_TYPE.VERTICAL}
                        gapType={Stack.GAP_TYPE.TIGHT}>
                        <StackItem>
                            <AccountPicker
                                value={this.state.accountId}
                                onChange={this.onChangeAccount}
                            />
                        </StackItem>
                        {accounts && (
                            <StackItem>

                                <Select value={selectedAccount}  onChange={(evt, value) => this.selectAccount(value)} >
                                    {accounts.map((a) => {
                                        return (
                                            <SelectItem key={a.id} value={a}>
                                                {a.name}
                                            </SelectItem>
                                        )
                                    })}
                                </Select>
                            </StackItem>
                        )
                        }

                        <StackItem>
                            <hr />
                            <PlatformStateContext.Consumer>
                                {(PlatformState) => {
                                    /* Taking a peek at the PlatformState */
                                    console.log('Entered PlatformStateContext Elasticsearch tab...')
                                    const since = timeRangeToNrql(PlatformState);
                                    return (
                                        <>
                                            <Grid className="firsttab-grid" spacingType={[Grid.SPACING_TYPE.NONE, Grid.SPACING_TYPE.NONE]}>
                                                <GridItem className="firsttab-content-container" columnSpan={3}>
                                                    <main className="firsttab-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>Cluster Status Summary - this is the cluster health status</strong>
                                                        </HeadingText>
                                                        <BillboardChart fullWidth accountId={accountId} query={elasticClustSum+since} className="chart" />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="firsttab-content-container" columnSpan={3}>
                                                    <main className="firsttab-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>Active Primary Shards</strong>
                                                        </HeadingText>
                                                        <BillboardChart fullWidth accountId={accountId} query={elasticActPriShards+since}className="chart"  />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="firsttab-content-container" columnSpan={3}>
                                                    <main className="firsttab-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>Active Shards in Cluster</strong>
                                                        </HeadingText>
                                                        <BillboardChart fullWidth accountId={accountId} query={elasticActShardsClust+since} className="chart"/>
                                                    </main>
                                                </GridItem>
                                                <GridItem className="firsttab-content-container" columnSpan={3}>
                                                    <main className="firsttab-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>Index health - this will show the index name and color status</strong>
                                                        </HeadingText>
                                                        <BarChart fullWidth accountId={accountId} query={elasticIndexHealth+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="firsttab-content-container" columnSpan={12}>
                                                    <main className="firsttab-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>ElasticSearch Status by node information</strong><Link to="https://wiki.cmdb.com/hc/en-us/articles/360040757112-Elasticsearch-troubleshooter"> Elasticsearch troubleshooter </Link>

                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={elasticState+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="firsttab-content-container" columnSpan={12}>
                                                    <main className="firsttab-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>ElasticSearch Index Information</strong>
                                                        </HeadingText>
                                                        <TableChart fullWidth accountId={accountId} query={elasticIndexInfo+since} className="table"/>
                                                    </main>
                                                </GridItem>
                                                <GridItem className="firsttab-content-container" columnSpan={12}>
                                                    <main className="firsttab-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>ElasticSearch Process CPU %</strong>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={elasticProc+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="firsttab-content-container" columnSpan={12}>
                                                    <main className="firsttab-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>ElasticSearch Memory garbage collection - this is very important, if Elasticsearch is garbage collecting, it is low on memory</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={elasticGc+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="firsttab-content-container" columnSpan={12}>
                                                    <main className="firsttab-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>ElasticSearch Index information</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={elastic+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="firsttab-content-container" columnSpan={12}>
                                                    <main className="firsttab-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>ElasticSearch Index Size</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={elasticIndexSz+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="firsttab-content-container" columnSpan={12}>
                                                    <main className="firsttab-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>ElasticSearch Errors</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={elasticErr+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="firsttab-content-container" columnSpan={12}>
                                                    <main className="firsttab-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>ElasticSearch Unassigned Shards, will move cluster from green to yellow</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={elasticUnassignedShards+since} />
                                                    </main>
                                                </GridItem>

                                            </Grid>
                                        </>
                                    );
                                }}
                            </PlatformStateContext.Consumer>
                        </StackItem>
                    </Stack>
                </TabsItem>

                <TabsItem label={`Redis`} value={3}>
                    <Stack
                        fullWidth
                        horizontalType={Stack.HORIZONTAL_TYPE.FILL}
                        directionType={Stack.DIRECTION_TYPE.VERTICAL}
                        gapType={Stack.GAP_TYPE.TIGHT}>
                        <StackItem>
                            <AccountPicker
                                value={this.state.accountId}
                                onChange={this.onChangeAccount}
                            />
                        </StackItem>
                        {accounts && (
                            <StackItem>

                                <Select value={selectedAccount}  onChange={(evt, value) => this.selectAccount(value)} >
                                    {accounts.map((a) => {
                                        return (
                                            <SelectItem key={a.id} value={a}>
                                                {a.name}
                                            </SelectItem>
                                        )
                                    })}
                                </Select>
                            </StackItem>
                        )
                        }

                        <StackItem>
                            <hr />
                            <PlatformStateContext.Consumer>
                                {(PlatformState) => {
                                    /* Taking a peek at the PlatformState */
                                    console.log('Entered PlatformStateContext Redis tab...')
                                    const since = timeRangeToNrql(PlatformState);
                                    return (
                                        <>
                                            <Grid className="firsttab-grid" spacingType={[Grid.SPACING_TYPE.NONE, Grid.SPACING_TYPE.NONE]}>
                                                <GridItem className="primary-content-container" columnSpan={4}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>  Redis node summary</strong>
                                                        </HeadingText>
                                                        <BillboardChart fullWidth accountId={accountId} query={redisBill+since} className="chart" />
                                                    </main>
                                                </GridItem>

                                                <GridItem className="primary-content-container" columnSpan={8}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>   Redis node detail</strong>
                                                        </HeadingText>
                                                        <TableChart fullWidth accountId={accountId} query={redisNode+since} className="table"  />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>   Redis node roles timeline</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={redisNodes+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>   Connection to Redis</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={redisConn+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>   Commands per second, by node</strong>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={redisCommands+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>   Redis % of memory used</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={redisThresh+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>    Redis used memory</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={redisUsedMem+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>    Redis changes since last db save</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={redisChngLstSv+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>  Redis synchronization from Log</strong>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={redisLog+since} />
                                                    </main>
                                                </GridItem>


                                            </Grid>
                                        </>
                                    );
                                }}
                            </PlatformStateContext.Consumer>
                        </StackItem>
                    </Stack>
                </TabsItem>

                <TabsItem label={`MySQL`} value={4}>
                    <Stack
                        fullWidth
                        horizontalType={Stack.HORIZONTAL_TYPE.FILL}
                        directionType={Stack.DIRECTION_TYPE.VERTICAL}
                        gapType={Stack.GAP_TYPE.TIGHT}>
                        <StackItem>
                            <AccountPicker
                                value={this.state.accountId}
                                onChange={this.onChangeAccount}
                            />
                        </StackItem>
                        {accounts && (
                            <StackItem>

                                <Select value={selectedAccount}  onChange={(evt, value) => this.selectAccount(value)} >
                                    {accounts.map((a) => {
                                        return (
                                            <SelectItem key={a.id} value={a}>
                                                {a.name}
                                            </SelectItem>
                                        )
                                    })}
                                </Select>
                            </StackItem>
                        )
                        }

                        <StackItem>
                            <hr />
                            <PlatformStateContext.Consumer>
                                {(PlatformState) => {
                                    /* Taking a peek at the PlatformState */
                                    console.log('Entered PlatformStateContext MySQL tab...')
                                    const since = timeRangeToNrql(PlatformState);
                                    return (
                                        <>
                                            <Grid className="firsttab-grid" spacingType={[Grid.SPACING_TYPE.NONE, Grid.SPACING_TYPE.NONE]}>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>   MySql % free storage by node</strong> <Link to="https://wiki.cmdb.com/hc/en-us/articles/360037591972">   MySQL disk space is low </Link>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={storFreeMySql+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={4}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>    MySql Connections by Node</strong>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={dbConns+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={8}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>    MySql Node Summary</strong>
                                                        </HeadingText>
                                                        <TableChart fullWidth accountId={accountId} query={dbNode+since} className="table" />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>    Galera Number of Nodes in cluster</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={galeraNumNodes+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>    Galera Node shutdowns and starts</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={galeraNodeShut+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>    Galera Log</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={galeraLog+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>   Galera Log by Host</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={galeraLogHost+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>Database performance </strong>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={dbPerf+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>   Transaction Database Call Count</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={database_call_count+since} />
                                                    </main>
                                                </GridItem>

                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong> cron_schedule table updates</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={datastoreOpsCron+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>  Slow Query Traces </strong>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={SQLTrace+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>Datastore Operations Tables - top 10 operations by tablename, this graph may not load if the timeline is greater than 3 days</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={datastoreOpsTable+since} />
                                                    </main>
                                                </GridItem>



                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>    cron table change </strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={cron_sched+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>    Deadlocks </strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={deadlock+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>    DB Statistics </strong>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={dbHealth+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>   Request frequency</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={dbReqs+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>HTTP status errors</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={dbStatusErr+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>   Database Errors, filter out the high frequency messages - you may see root cause messages</strong>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={dbErrors1+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>   DB Error table </strong>     <Link to="https://mariadb.com/kb/en/mariadb-error-codes/">   MariaDB Error Codes</Link>
                                                        </HeadingText>

                                                        <TableChart fullWidth accountId={accountId} query={dbErrorsTable+since} className="table" />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>   Database traces</strong>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={dbTrace+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>   Database processes </strong>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={dbprocs+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>    MySql Non Sleeping Threads by Node</strong>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={dbConnsRunning+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>    MySql Running and Sleeping Threads by environment</strong>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={dbConnsRunningSleeping+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>   MySQL mem used by node </strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={mySQLmem+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>   Database mysql-slow.log </strong>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={slowMySQL+since} />
                                                    </main>
                                                </GridItem>

                                            </Grid>
                                        </>
                                    );
                                }}
                            </PlatformStateContext.Consumer>
                        </StackItem>
                    </Stack>
                </TabsItem>

                <TabsItem label={`PHP`} value={5}>
                    <Stack
                        fullWidth
                        horizontalType={Stack.HORIZONTAL_TYPE.FILL}
                        directionType={Stack.DIRECTION_TYPE.VERTICAL}
                        gapType={Stack.GAP_TYPE.TIGHT}>
                        <StackItem>
                            <AccountPicker
                                value={this.state.accountId}
                                onChange={this.onChangeAccount}
                            />
                        </StackItem>
                        {accounts && (
                            <StackItem>

                                <Select value={selectedAccount}  onChange={(evt, value) => this.selectAccount(value)} >
                                    {accounts.map((a) => {
                                        return (
                                            <SelectItem key={a.id} value={a}>
                                                {a.name}
                                            </SelectItem>
                                        )
                                    })}
                                </Select>
                            </StackItem>
                        )
                        }

                        <StackItem>
                            <hr />
                            <PlatformStateContext.Consumer>
                                {(PlatformState) => {
                                    /* Taking a peek at the PlatformState */
                                    console.log('Entered PlatformStateContext PHP tab...')
                                    const since = timeRangeToNrql(PlatformState);
                                    return (
                                        <>
                                            <Grid className="firsttab-grid" spacingType={[Grid.SPACING_TYPE.NONE, Grid.SPACING_TYPE.NONE]}>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>   PHP active process details</strong>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={phpProcDetail+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>   PHP process load (# of PHP processes and % of CPU load)</strong>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={phpCPUProcDetail+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>    PHP Memory detail </strong>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={phpMemoryDetail+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>   PHP CPU Utilization %</strong>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={phpCPUProcPct+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>  PHP Process states </strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={phpLog+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>  PHP Errors</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={phpErrs+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>  PHP processes count</strong>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={phpProc+since} />
                                                    </main>
                                                </GridItem>

                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>   Database Errors</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={dbErrors1+since} />
                                                    </main>
                                                </GridItem>

                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>   Database traces</strong>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={dbTrace+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>  Database mysql-slow.log </strong>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={slowMySQL+since} />
                                                    </main>
                                                </GridItem>


                                            </Grid>
                                        </>
                                    );
                                }}
                            </PlatformStateContext.Consumer>

                        </StackItem>
                    </Stack>
                </TabsItem>
                <TabsItem label={`Deploy`} value={6}>
                    <Stack
                        fullWidth
                        horizontalType={Stack.HORIZONTAL_TYPE.FILL}
                        directionType={Stack.DIRECTION_TYPE.VERTICAL}
                        gapType={Stack.GAP_TYPE.TIGHT}>
                        <StackItem>
                            <AccountPicker
                                value={this.state.accountId}
                                onChange={this.onChangeAccount}
                            />
                        </StackItem>
                        {accounts && (
                            <StackItem>

                                <Select value={selectedAccount}  onChange={(evt, value) => this.selectAccount(value)} >
                                    {accounts.map((a) => {
                                        return (
                                            <SelectItem key={a.id} value={a}>
                                                {a.name}
                                            </SelectItem>
                                        )
                                    })}
                                </Select>
                            </StackItem>
                        )
                        }

                        <StackItem>
                            <hr />
                            <PlatformStateContext.Consumer>
                                {(PlatformState) => {
                                    /* Taking a peek at the PlatformState */
                                    console.log('Entered PlatformStateContext Deploy tab...')
                                    const since = timeRangeToNrql(PlatformState);
                                    return (
                                        <>
                                            <Grid className="firsttab-grid" spacingType={[Grid.SPACING_TYPE.NONE, Grid.SPACING_TYPE.NONE]}>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>   Deploy log</strong><Link to="https://wiki.cmdb.com/hc/en-us/articles/360040986912-Deployment-troubleshooter"> Deployment Troubleshooter</Link>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={deployLog+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>   Deploy State</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={deployState+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>  Deploy Log Detail </strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={deployLogDetail+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>  Post Deploy Log Detail </strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={postDeployLogDetail+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>   Cloud Log Detail </strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={deployCloudLogDetail+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>  Count of modules imported during deploy </strong>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={deployCountModules+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>  Deployed module list</strong>
                                                        </HeadingText>
                                                        <TableChart fullWidth accountId={accountId} query={deployModules+since} className="table" />
                                                    </main>
                                                </GridItem>

                                            </Grid>
                                        </>
                                    );
                                }}
                            </PlatformStateContext.Consumer>

                        </StackItem>
                    </Stack>
                </TabsItem>
                <TabsItem label={`Alerts`} value={7}>
                    <Stack
                        fullWidth
                        horizontalType={Stack.HORIZONTAL_TYPE.FILL}
                        directionType={Stack.DIRECTION_TYPE.VERTICAL}
                        gapType={Stack.GAP_TYPE.TIGHT}>
                        <StackItem>
                            <AccountPicker
                                value={this.state.accountId}
                                onChange={this.onChangeAccount}
                            />
                        </StackItem>
                        {accounts && (
                            <StackItem>

                                <Select value={selectedAccount}  onChange={(evt, value) => this.selectAccount(value)} >
                                    {accounts.map((a) => {
                                        return (
                                            <SelectItem key={a.id} value={a}>
                                                {a.name}
                                            </SelectItem>
                                        )
                                    })}
                                </Select>
                            </StackItem>
                        )
                        }

                        <StackItem>
                            <hr />
                            <PlatformStateContext.Consumer>
                                {(PlatformState) => {
                                    /* Taking a peek at the PlatformState */
                                    console.log('Entered PlatformStateContext Alerts tab...')
                                    const since = timeRangeToNrql(PlatformState);
                                    return (
                                        <>
                                            <Grid className="firsttab-grid" spacingType={[Grid.SPACING_TYPE.NONE, Grid.SPACING_TYPE.NONE]}>
                                                <GridItem className="primary-content-container" columnSpan={6}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>  Open Critical Alerts</strong>
                                                        </HeadingText>
                                                        <BarChart fullWidth accountId={accountId} query={alertOpen+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={6}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>    Closed Critcal Alerts</strong>
                                                        </HeadingText>
                                                        <BarChart fullWidth accountId={accountId} query={alertClose+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>  Critical Alert Details </strong>
                                                        </HeadingText>
                                                        <TableChart fullWidth accountId={accountId} query={alertRecentDetails+since} className="table"/>
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>Infrastructure Alert Details </strong>
                                                        </HeadingText>
                                                        <TableChart fullWidth accountId={accountId} query={alertInfra+since} className="table"/>
                                                    </main>
                                                </GridItem>


                                            </Grid>
                                        </>
                                    );
                                }}
                            </PlatformStateContext.Consumer>

                        </StackItem>
                    </Stack>
                </TabsItem>
                <TabsItem label={`WAF`} value={8}>
                    <Stack
                        fullWidth
                        horizontalType={Stack.HORIZONTAL_TYPE.FILL}
                        directionType={Stack.DIRECTION_TYPE.VERTICAL}
                        gapType={Stack.GAP_TYPE.TIGHT}>
                        <StackItem>
                            <AccountPicker
                                value={this.state.accountId}
                                onChange={this.onChangeAccount}
                            />
                        </StackItem>
                        {accounts && (
                            <StackItem>

                                <Select value={selectedAccount}  onChange={(evt, value) => this.selectAccount(value)} >
                                    {accounts.map((a) => {
                                        return (
                                            <SelectItem key={a.id} value={a}>
                                                {a.name}
                                            </SelectItem>
                                        )
                                    })}
                                </Select>
                            </StackItem>
                        )
                        }

                        <StackItem>
                            <hr />
                            <PlatformStateContext.Consumer>
                                {(PlatformState) => {
                                    /* Taking a peek at the PlatformState */
                                    console.log('Entered PlatformStateContext WAF tab...')
                                    const since = timeRangeToNrql(PlatformState);
                                    return (
                                        <>
                                            <Grid className="firsttab-grid" spacingType={[Grid.SPACING_TYPE.NONE, Grid.SPACING_TYPE.NONE]}>
                                                <GridItem className="primary-content-container" columnSpan={6}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong> WAF traffic summary:</strong>
                                                        </HeadingText>
                                                        <BarChart fullWidth accountId={accountId} query={wafSummary+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={6}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>   WAF Top 10 blocked IP Addresses</strong>
                                                        </HeadingText>
                                                        <BarChart fullWidth accountId={accountId} query={wafBlockedIP+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={4}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>WAF Top 10 countries for blocked requests</strong>
                                                        </HeadingText>
                                                        <BarChart fullWidth accountId={accountId} query={wafBlockedCountry+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={4}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>   WAF Top 10 logged IP Addresses</strong>
                                                        </HeadingText>
                                                        <BarChart fullWidth accountId={accountId} query={wafLoggedIP+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={4}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>Top 10 WAF Rules Executed and Logged, by IP address </strong>
                                                        </HeadingText>
                                                        <BarChart fullWidth accountId={accountId} query={wafRuleLoggedExecutedCount+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>WAF Logged Details </strong>
                                                        </HeadingText>
                                                        <TableChart fullWidth accountId={accountId} query={wafLoggedDetail+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>WAF Blocked Details </strong>
                                                        </HeadingText>
                                                        <TableChart fullWidth accountId={accountId} query={wafBlockedDetail+since} className="table"/>
                                                    </main>
                                                </GridItem>


                                            </Grid>
                                        </>
                                    );
                                }}
                            </PlatformStateContext.Consumer>




                        </StackItem>

                    </Stack>
                </TabsItem>
                <TabsItem label={`CDN`} value={9}>
                    <Stack
                        fullWidth
                        horizontalType={Stack.HORIZONTAL_TYPE.FILL}
                        directionType={Stack.DIRECTION_TYPE.VERTICAL}
                        gapType={Stack.GAP_TYPE.TIGHT}>
                        <StackItem>
                            <AccountPicker
                                value={this.state.accountId}
                                onChange={this.onChangeAccount}
                            />
                        </StackItem>
                        {accounts && (
                            <StackItem>

                                <Select value={selectedAccount}  onChange={(evt, value) => this.selectAccount(value)} >
                                    {accounts.map((a) => {
                                        return (
                                            <SelectItem key={a.id} value={a}>
                                                {a.name}
                                            </SelectItem>
                                        )
                                    })}
                                </Select>
                            </StackItem>
                        )
                        }

                        <StackItem>
                            <hr />
                            <PlatformStateContext.Consumer>
                                {(PlatformState) => {
                                    /* Taking a peek at the PlatformState */
                                    console.log('Entered PlatformStateContext CDN tab...')
                                    const since = timeRangeToNrql(PlatformState);
                                    return (
                                        <>
                                            <Grid className="firsttab-grid" spacingType={[Grid.SPACING_TYPE.NONE, Grid.SPACING_TYPE.NONE]}>
                                                <GridItem className="primary-content-container" columnSpan={2}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>HIT rate</strong>
                                                        </HeadingText>
                                                        <BillboardChart fullWidth accountId={accountId} query={cdnHitRate+since} className="chart"  />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={1.9}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>HIT processing</strong>
                                                        </HeadingText>
                                                        <BillboardChart fullWidth accountId={accountId} query={cdnHitProcTime+since} className="chart" />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={2}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>MISS rate</strong>
                                                        </HeadingText>
                                                        <BillboardChart fullWidth accountId={accountId} query={cdnMissRate+since}className="chart"  />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={1.9}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>MISS time</strong>
                                                        </HeadingText>
                                                        <BillboardChart fullWidth accountId={accountId} query={cdnMissProcTime+since} className="chart"  />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={2}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>HIT Ratio</strong>
                                                        </HeadingText>
                                                        <BillboardChart fullWidth accountId={accountId} query={cdnHitPercentage+since}className="chart"  />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={1.9}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>ERROR %</strong>
                                                        </HeadingText>
                                                        <BillboardChart fullWidth accountId={accountId} query={cdnErrorPercentage+since} className="chart" />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={2}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>Total requests</strong>
                                                        </HeadingText>
                                                        <BillboardChart fullWidth accountId={accountId} query={cdnRequests+since} className="chart"/>
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={1.9}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>ERROR rate</strong>
                                                        </HeadingText>
                                                        <BillboardChart fullWidth accountId={accountId} query={cdnErrRate+since} className="chart" />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>Fastly Cache Summary for selected time period</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={fastlyCache+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>Fastly Cache Average Response for selected time period in seconds</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={fastlyCacheTime+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>Fastly Cache Average Response for selected time period in seconds, faceted by POP</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={fastlyCacheTimePOP+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={4}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong> Total Bandwidth (All POPs) since selected timeframe compared with 1 week ago (% increase/decreased)</strong>
                                                        </HeadingText>
                                                        <BillboardChart fullWidth accountId={accountId} query={cdnTotalBandwidth+since} className="chart"/>
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={4}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>Requests - Since selected timeframe compared with 1 week ago</strong>
                                                        </HeadingText>
                                                        <BarChart fullWidth accountId={accountId} query={cdnRequests+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={4}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>Response Status (count)</strong>
                                                        </HeadingText>
                                                        <BarChart fullWidth accountId={accountId} query={cdnResponseStatus+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={4}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>Bandwidth by POP</strong>
                                                        </HeadingText>
                                                        <BarChart fullWidth accountId={accountId} query={cdnTotalBandwidthByPop+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={4}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>Top 5 URLs (5xx or 3xx status codes) </strong>
                                                        </HeadingText>
                                                        <BarChart fullWidth accountId={accountId} query={cdnTop5_5xx3xx+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={4}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>Top 25 URLs (200 status) </strong>
                                                        </HeadingText>
                                                        <BarChart fullWidth accountId={accountId} query={cdnTop5_2xx+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={6}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>Duration by Response Status</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={cdnDurationByResponseStatus+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={6}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>Duration by Response Status, top 25 urls</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={cdnDurationByResponseStatusURLtop25+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>Duration by Response Status, top 25 non 200 status</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={cdnDurationByResponseStatusURLtop25non200+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>Error count by POP timeline</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={cdnTotalErrorByPop+since} />
                                                    </main>
                                                </GridItem>

                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>Duration by Response Status, top 25 client IP, non 200 status</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={cdnDurationByResponseStatusClienIPtop25non200+since} />
                                                    </main>
                                                </GridItem>

                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>IP Frequency</strong> <Link to="https://wiki.cmdb.com/hc/en-us/articles/360039447892">   How to block malicious traffic on Fastly level </Link>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={ipFreq+since} />
                                                    </main>
                                                </GridItem>

                                            </Grid>
                                        </>
                                    );
                                }}
                            </PlatformStateContext.Consumer>




                        </StackItem>

                    </Stack>
                </TabsItem>

                <TabsItem label={`RabbitMQ`} value={10}>
                    <Stack
                        fullWidth
                        horizontalType={Stack.HORIZONTAL_TYPE.FILL}
                        directionType={Stack.DIRECTION_TYPE.VERTICAL}
                        gapType={Stack.GAP_TYPE.TIGHT}>
                        <StackItem>
                            <AccountPicker
                                value={this.state.accountId}
                                onChange={this.onChangeAccount}
                            />
                        </StackItem>
                        {accounts && (
                            <StackItem>

                                <Select value={selectedAccount}  onChange={(evt, value) => this.selectAccount(value)} >
                                    {accounts.map((a) => {
                                        return (
                                            <SelectItem key={a.id} value={a}>
                                                {a.name}
                                            </SelectItem>
                                        )
                                    })}
                                </Select>
                            </StackItem>
                        )
                        }

                        <StackItem>
                            <hr />
                            <PlatformStateContext.Consumer>
                                {(PlatformState) => {
                                    /* Taking a peek at the PlatformState */
                                    console.log('Entered PlatformStateContext RabbitMQ tab...')
                                    const since = timeRangeToNrql(PlatformState);
                                    return (
                                        <>
                                            <Grid className="firsttab-grid" spacingType={[Grid.SPACING_TYPE.NONE, Grid.SPACING_TYPE.NONE]}>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>RabbitMQ Infrastructure events</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={rabbitEvents+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>RabbitMQ Service Start / Stop signals</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={rabbitStartStop+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>RabbitMQ Errors</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={rabbitError+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>RabbitMQ Node status</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={rabbitNode+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>RabbitMQ Message High Level Summary status by Queue</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={rabbitMessagesSummary+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>RabbitMQ Message Detail Summary</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={rabbitCommMessages+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>RabbitMQ Queue Consumption MB</strong>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={rabbitQueueConsumption+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>RabbitMQ Published Messages by Queue</strong>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={rabbitPublishedByQueue+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>RabbitMQ Published Message Throughput by Queue</strong>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={rabbitPublishedThroughputByQueue+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>RabbitMQ Total Message Throughput by Queue</strong>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={rabbitTotalMsgThroughputByQueue+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>RabbitMQ Consumers by Queue</strong>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={rabbitConsumersByQueue+since} />
                                                    </main>
                                                </GridItem>

                                            </Grid>
                                        </>
                                    );
                                }}
                            </PlatformStateContext.Consumer>




                        </StackItem>

                    </Stack>
                </TabsItem>
                <TabsItem label={`Infra`} value={11}>
                    <Stack
                        fullWidth
                        horizontalType={Stack.HORIZONTAL_TYPE.FILL}
                        directionType={Stack.DIRECTION_TYPE.VERTICAL}
                        gapType={Stack.GAP_TYPE.TIGHT}>
                        <StackItem>
                            <AccountPicker
                                value={this.state.accountId}
                                onChange={this.onChangeAccount}
                            />
                        </StackItem>
                        {accounts && (
                            <StackItem>

                                <Select value={selectedAccount}  onChange={(evt, value) => this.selectAccount(value)} >
                                    {accounts.map((a) => {
                                        return (
                                            <SelectItem key={a.id} value={a}>
                                                {a.name}
                                            </SelectItem>
                                        )
                                    })}
                                </Select>
                            </StackItem>
                        )
                        }

                        <StackItem>
                            <hr />
                            <PlatformStateContext.Consumer>
                                {(PlatformState) => {
                                    /* Taking a peek at the PlatformState */
                                    console.log('Entered Infra tab...')
                                    const since = timeRangeToNrql(PlatformState);
                                    return (
                                        <>
                                            <Grid className="firsttab-grid" spacingType={[Grid.SPACING_TYPE.NONE, Grid.SPACING_TYPE.NONE]}>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong> Service Alerts - Infrastructure Alerts by application name</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={serviceAlertInfa+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong> Inode usage by mount</strong>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={infra_inode_pct+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong> vCPU tier view over timeline GREATER 2 weeks (You will need to select a timeline GREATER than 2 weeks). NOTE: The sample rate will be per day. If cluster upsizes/downsizes occur on a day, the ending tier size will be displayed on the following day.</strong>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={vCPUcountDay+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong> vCPU tier view over timeline (need to select a timeline GREATER than 24 hours but not greater than 2 weeks)</strong>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={vCPUcount+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong> vCPU tier view over timeline BY NODE, should look at timeline LESS than 24 hours </strong>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={vCPUCountNode+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>Instance details</strong>
                                                        </HeadingText>
                                                        <TableChart fullWidth accountId={accountId} query={instanceType+since} className="table" />
                                                    </main>
                                                </GridItem>

                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong> Logging, if there is a broken line for a node, it indicates non-responsive node during that time period:</strong>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={hostLogCount+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>Logging, if there is a broken line for a node,  indicates non-responsive node during that time period:</strong>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={LogCountsbyHost+since} />
                                                    </main>
                                                </GridItem>


                                            </Grid>
                                        </>
                                    );
                                }}
                            </PlatformStateContext.Consumer>




                        </StackItem>

                    </Stack>
                </TabsItem>
                <TabsItem label={`Crons`} value={12}>
                    <Stack
                        fullWidth
                        horizontalType={Stack.HORIZONTAL_TYPE.FILL}
                        directionType={Stack.DIRECTION_TYPE.VERTICAL}
                        gapType={Stack.GAP_TYPE.TIGHT}>
                        <StackItem>
                            <AccountPicker
                                value={this.state.accountId}
                                onChange={this.onChangeAccount}
                            />
                        </StackItem>
                        {accounts && (
                            <StackItem>

                                <Select value={selectedAccount}  onChange={(evt, value) => this.selectAccount(value)} >
                                    {accounts.map((a) => {
                                        return (
                                            <SelectItem key={a.id} value={a}>
                                                {a.name}
                                            </SelectItem>
                                        )
                                    })}
                                </Select>
                            </StackItem>
                        )
                        }

                        <StackItem>
                            <hr />
                            <PlatformStateContext.Consumer>
                                {(PlatformState) => {
                                    /* Taking a peek at the PlatformState */
                                    console.log('Entered Crons tab...')
                                    const since = timeRangeToNrql(PlatformState);
                                    return (
                                        <>
                                            <Grid className="firsttab-grid" spacingType={[Grid.SPACING_TYPE.NONE, Grid.SPACING_TYPE.NONE]}>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong> Cron transaction duration in seconds</strong>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={cron_trans+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>    MySql Non Sleeping Threads by Node</strong>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={dbConnsRunning+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong> SQL Trace count by path</strong>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={sqltrace+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong> Cron database call</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={database_call_count_cron+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong> Cron schedule table locks</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={datastoreOpsCronLock+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong> Cron schedule clean cron fired</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={cron_sched_cleaned_completed+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong> Cron schedule clean records details table</strong>
                                                        </HeadingText>
                                                        <TableChart fullWidth accountId={accountId} query={cron_sched_cleaned_details+since} className="table"/>
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong> cron_schedule table updates</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={datastoreOpsCron+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>Datastore Operations Tables - top 10 operations by tablename, this graph may not load if the timeline is greater than 3 days</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={datastoreOpsTable+since} />
                                                    </main>
                                                </GridItem>




                                            </Grid>
                                        </>
                                    );
                                }}
                            </PlatformStateContext.Consumer>




                        </StackItem>

                    </Stack>
                </TabsItem>
                <TabsItem label={`Indexing`} value={13}>
                    <Stack
                        fullWidth
                        horizontalType={Stack.HORIZONTAL_TYPE.FILL}
                        directionType={Stack.DIRECTION_TYPE.VERTICAL}
                        gapType={Stack.GAP_TYPE.TIGHT}>
                        <StackItem>
                            <AccountPicker
                                value={this.state.accountId}
                                onChange={this.onChangeAccount}
                            />
                        </StackItem>
                        {accounts && (
                            <StackItem>

                                <Select value={selectedAccount}  onChange={(evt, value) => this.selectAccount(value)} >
                                    {accounts.map((a) => {
                                        return (
                                            <SelectItem key={a.id} value={a}>
                                                {a.name}
                                            </SelectItem>
                                        )
                                    })}
                                </Select>
                            </StackItem>
                        )
                        }

                        <StackItem>
                            <hr />
                            <PlatformStateContext.Consumer>
                                {(PlatformState) => {
                                    /* Taking a peek at the PlatformState */
                                    console.log('Entered Indexing tab...')
                                    const since = timeRangeToNrql(PlatformState);
                                    return (
                                        <>
                                            <Grid className="firsttab-grid" spacingType={[Grid.SPACING_TYPE.NONE, Grid.SPACING_TYPE.NONE]}>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>Core index invalidated</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={indexInvalidated+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>Core index rebuilds</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={indexRebuild+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>catalogsearch index table(s)</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={indexCatalogsearch+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>product index table(s)</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={indexProduct+since} />
                                                    </main>
                                                </GridItem>





                                            </Grid>
                                        </>
                                    );
                                }}
                            </PlatformStateContext.Consumer>




                        </StackItem>

                    </Stack>
                </TabsItem>
                <TabsItem label={`QuickView`} value={14}>
                    <Stack
                        fullWidth
                        horizontalType={Stack.HORIZONTAL_TYPE.FILL}
                        directionType={Stack.DIRECTION_TYPE.VERTICAL}
                        gapType={Stack.GAP_TYPE.TIGHT}>
                        <StackItem>
                            <AccountPicker
                                value={this.state.accountId}
                                onChange={this.onChangeAccount}
                            />
                        </StackItem>
                        {accounts && (
                            <StackItem>

                                <Select value={selectedAccount}  onChange={(evt, value) => this.selectAccount(value)} >
                                    {accounts.map((a) => {
                                        return (
                                            <SelectItem key={a.id} value={a}>
                                                {a.name}
                                            </SelectItem>
                                        )
                                    })}
                                </Select>
                            </StackItem>
                        )
                        }

                        <StackItem>
                            <hr />
                            <PlatformStateContext.Consumer>
                                {(PlatformState) => {
                                    /* Taking a peek at the PlatformState */
                                    console.log('Entered QuickView tab...')
                                    const since = timeRangeToNrql(PlatformState);
                                    return (
                                        <>
                                            <Grid className="firsttab-grid" spacingType={[Grid.SPACING_TYPE.NONE, Grid.SPACING_TYPE.NONE]}>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>Alerts</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={alertTimeLine+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>Upsize / Downsize by node</strong>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={vCPUCountNode+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>CPU Utilization</strong>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={cpuUsage+since} />
                                                    </main>
                                                </GridItem>





                                            </Grid>
                                        </>
                                    );
                                }}
                            </PlatformStateContext.Consumer>




                        </StackItem>

                    </Stack>
                </TabsItem>
                <TabsItem label={`Security`} value={15}>
                    <Stack
                        fullWidth
                        horizontalType={Stack.HORIZONTAL_TYPE.FILL}
                        directionType={Stack.DIRECTION_TYPE.VERTICAL}
                        gapType={Stack.GAP_TYPE.TIGHT}>
                        <StackItem>
                            <AccountPicker
                                value={this.state.accountId}
                                onChange={this.onChangeAccount}
                            />
                        </StackItem>
                        {accounts && (
                            <StackItem>

                                <Select value={selectedAccount}  onChange={(evt, value) => this.selectAccount(value)} >
                                    {accounts.map((a) => {
                                        return (
                                            <SelectItem key={a.id} value={a}>
                                                {a.name}
                                            </SelectItem>
                                        )
                                    })}
                                </Select>
                            </StackItem>
                        )
                        }

                        <StackItem>
                            <hr />
                            <PlatformStateContext.Consumer>
                                {(PlatformState) => {
                                    /* Taking a peek at the PlatformState */
                                    console.log('Entered Security tab...')
                                    const since = timeRangeToNrql(PlatformState);
                                    return (
                                        <>
                                            <Grid className="firsttab-grid" spacingType={[Grid.SPACING_TYPE.NONE, Grid.SPACING_TYPE.NONE]}>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>API calls by IP, details by URL </strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={apiRestDetail+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>Forgot Password access</strong>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={apiRestDetailForgotPW+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>Create Account access</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={apiRestDetailCreateAccount+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>POST activities</strong>
                                                        </HeadingText>
                                                        <AreaChart fullWidth accountId={accountId} query={apiRestDetailPOST+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>POST activities summary table</strong>
                                                        </HeadingText>
                                                        <TableChart fullWidth accountId={accountId} query={apiRestDetailPOSTsummary+since} className="table" />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>POST activities details table</strong>
                                                        </HeadingText>
                                                        <TableChart fullWidth accountId={accountId} query={apiRestDetailPOSTtable+since} className="table"/>
                                                    </main>
                                                </GridItem>

                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>Guest Carts activities</strong>
                                                        </HeadingText>
                                                        <LineChart fullWidth accountId={accountId} query={apiRestDetailGuestCarts+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>API - forgotpassword, create account by Countries</strong>
                                                        </HeadingText>
                                                        <BarChart fullWidth accountId={accountId} query={apiRestDetailCountries+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>API - forgotpassword, create account by Countries</strong>
                                                        </HeadingText>
                                                        <BarChart fullWidth accountId={accountId} query={apiRestDetailIP+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>Guest cart activities by IP</strong>
                                                        </HeadingText>
                                                        <BarChart fullWidth accountId={accountId} query={apiRestDetailGuestCartsCount+since} />
                                                    </main>
                                                </GridItem>
                                                <GridItem className="primary-content-container" columnSpan={12}>
                                                    <main className="primary-content full-height">
                                                        <HeadingText spacingType={[HeadingText.SPACING_TYPE.MEDIUM]} type={HeadingText.TYPE.HEADING_4}>
                                                            <strong>Guest cart activities by Countries</strong>
                                                        </HeadingText>
                                                        <BarChart fullWidth accountId={accountId} query={apiRestDetailGuestCartsCountries+since} />
                                                    </main>
                                                </GridItem>




                                            </Grid>
                                        </>
                                    );
                                }}
                            </PlatformStateContext.Consumer>




                        </StackItem>

                    </Stack>
                </TabsItem>
                <TabsItem label={`Services`} value={16}>
                    <Stack
                        fullWidth
                        horizontalType={Stack.HORIZONTAL_TYPE.FILL}
                        directionType={Stack.DIRECTION_TYPE.VERTICAL}
                        gapType={Stack.GAP_TYPE.TIGHT}>
                        <StackItem>
                            <AccountPicker
                                value={this.state.accountId}
                                onChange={this.onChangeAccount}
                            />
                        </StackItem>
                        {accounts && (
                            <StackItem>

                                <Select value={selectedAccount}  onChange={(evt, value) => this.selectAccount(value)} >
                                    {accounts.map((a) => {
                                        return (
                                            <SelectItem key={a.id} value={a}>
                                                {a.name}
                                            </SelectItem>
                                        )
                                    })}
                                </Select>
                            </StackItem>
                        )
                        }

                    </Stack>
                </TabsItem>
            </Tabs>)

        );
    }

}
