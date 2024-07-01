#!/bin/bash
# Script: fetch_commerce_details.sh
# Description: Fetches commerce details from Magento Cloud environments.
# Author: abalachandra
# Version: 2.0
# Date: April 2024

# Usage: ./fetch_commerce_details.sh -p <project_id> -e <environment>

# Constants
ssh_url_prefix="ssh"
magento_cloud="magento-cloud"
node="1"

# Function to display usage information
displayUsage() {
    echo "Usage: $0 -p <project_id> -e <environment> -n <number-of-nodes>"
    echo "Options:"
    echo "  -p, --project_id        Specify the project ID."
    echo "  -e, --environment       Specify the environment type (master->starter or production or staging)."
    echo "  -h, --help              Display this help message."
    exit 1
}

# Function to execute common magento-cloud commands
executeMagentoCloudCommand() {
    output=$($magento_cloud $1 $2 2>&1)

    if [ $? -ne 0 ]; then
        echo "Error executing command."
        echo "Error output: $output"
        exit 1
    fi

    echo "$output" | awk '{print $0}'
}

# Parse command-line options
while [[ "$#" -gt 0 ]]; do
    case $1 in
        -p|--project_id) project_id="$2"; shift ;;
        -e|--environment) environment="$2"; shift ;;
        *) echo "Unknown parameter: $1"; exit 1 ;;
    esac
    shift
done

# Check if all required parameters are provided
if [[ -z "$project_id" || -z "$environment" ]]; then
    echo "Usage: $0 -p <project_id> -e <environment>"
    exit 1
fi

# Fetch details
region=$(executeMagentoCloudCommand "project:info region" "-p $project_id")
region_label=$(executeMagentoCloudCommand "subscription:info project_region_label" "-p $project_id")
customer_name=$(executeMagentoCloudCommand "project:info title" "-p $project_id")
customer_plan=$(executeMagentoCloudCommand "subscription:info plan" "-p $project_id")
project_url=$(executeMagentoCloudCommand "subscription:info project_ui" "-p $project_id")
machine_name=$(executeMagentoCloudCommand "environment:info machine_name" "-p $project_id -e $environment")

json_output=$(echo "{}" | jq --arg rl "$region_label" --arg cn "$customer_name" --arg cp "$customer_plan" --arg pid "$project_id" --arg purl "$project_url" --arg env "$environment" \
    '. + {"region": $rl, "company_name": $cn, "cloud_plan": $cp, "project_id": $pid, "project_url": $purl, "environment": $env}')

common_ssh_url="$ssh_url_prefix.$region"

# Generate the SSH URL
if [[ "$environment" == "master" || "$environment" == "integration" || "$environment" == "development" ]]; then
    # Fetch the application name
    app_name=$($magento_cloud repo:cat .magento.app.yaml -p $project_id -e $environment | grep 'name:' | awk '{print $2}')

    # Check if the application name was fetched successfully
    if [ -z "$app_name" ] || [[ "$app_name" == *"File not found: .magento.app.yaml"* ]]; then
        app_name="mymagento"
    fi
    ssh_url="$project_id-$machine_name--$app_name@$common_ssh_url"
else
    ssh_url="$node.ent-$project_id-$machine_name@$common_ssh_url"
fi

remoteCommands=$(ssh -n "$ssh_url" '
    front_url=$(bin/magento config:show web/secure/base_url | tr -d "\n")
    front_url=${front_url%/}  # Remove trailing slash
    admin_uri=$(bin/magento info:adminuri | cut -d'/' -f2 | tr -d "\n")
    locale=$(bin/magento config:show general/locale/timezone)
    commerce_version=$(bin/magento --version | awk "{print \$3}")
    ece_tools_version=$(grep -I "version" vendor/magento/ece-tools/composer.json | awk -F\" "{print \$4}")
    twofa_output=$(bin/magento config:show twofactorauth/general/force_providers 2>&1)
    php_version=$(php --version | grep -oP "PHP \K[0-9]+\.[0-9]+\.[0-9]+")
    mariadb_version=$(mysql -V | awk "{print \$5}" | cut -d"-" -f1 | cut -d"." -f1-3)
    if [[ $twofa_output == *"path doesn"* ]]; then
        twofa_enabled='not enabled'
        twofa_provider=""
    else
        twofa_enabled='enabled'
        twofa_provider=$twofa_output
    fi
    utc_time=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    echo "{}" | jq --arg cv "$commerce_version" --arg et "$ece_tools_version" --arg fv "$front_url" --arg av "$front_url/$admin_uri" --arg ut "$utc_time" --arg loc "$locale" --arg twofa "$twofa_enabled" --arg provider "$twofa_provider" --arg mdbv "$mariadb_version" \
    ". + {\"locale\": \$loc, \"commerce_version\": \$cv, \"ece_tools\": \$et, \"front_url\": \$fv, \"admin_url\": \$av, \"two_factor_auth\": \$twofa, \"two_factor_provider\": \$provider, \"mariadb_version\": \$mdbv, \"utc_time\": \$ut}"
')

# Check if the SSH command was successful
if [ $? -eq 0 ]; then
    combined_json=$(echo "$json_output" | jq --argjson rc "$remoteCommands" '. + $rc')
    echo "$combined_json"
else
    echo "Error executing SSH command:"
    echo "$remoteCommands"
fi
