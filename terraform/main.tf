terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "3.89.0"
    }
    azapi = {
      source  = "Azure/azapi"
      version = "1.12.0"
    }
  }

  backend "azurerm" {
    resource_group_name  = "tfstateresources"
    storage_account_name = "ngtfstate21823"
    container_name       = "reservations"
    key                  = "terraform.tfstate"
  }
}

provider "azapi" {
}

provider "azurerm" {
  features {

  }
}

variable "captcha_site_key" {
  type    = string
  default = "none"
}

variable "tenant_id" {
  type    = string
  default = "00000000-0000-0000-0000-000000000000"
}

resource "azurerm_resource_group" "my_rg" {
  name     = "reservations-resources"
  location = "West US"
}

resource "azurerm_storage_account" "function_storage" {
  name                     = "functionsareservations"
  resource_group_name      = azurerm_resource_group.my_rg.name
  location                 = azurerm_resource_group.my_rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_service_plan" "reservations_functions" {
  name                = "mb-app-service-plan"
  resource_group_name = azurerm_resource_group.my_rg.name
  location            = azurerm_resource_group.my_rg.location
  os_type             = "Linux"
  sku_name            = "Y1"
}

resource "azurerm_application_insights" "appinsights" {
  name                = "reservations-appinsights"
  location            = azurerm_resource_group.my_rg.location
  resource_group_name = azurerm_resource_group.my_rg.name
  application_type    = "web"
}

resource "azurerm_linux_function_app" "reservations_function_app" {
  name                = "reservations-function-app"
  resource_group_name = azurerm_resource_group.my_rg.name
  location            = azurerm_resource_group.my_rg.location

  storage_account_name       = azurerm_storage_account.function_storage.name
  storage_account_access_key = azurerm_storage_account.function_storage.primary_access_key
  service_plan_id            = azurerm_service_plan.reservations_functions.id

  site_config {
    application_insights_connection_string = azurerm_application_insights.appinsights.connection_string
  }

  app_settings = {
    CaptchaSecretKey    = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault.my_key_vault.vault_uri}/secrets/captcha-secret)"
    AcsConnectionString = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault.my_key_vault.vault_uri}/secrets/acs-connection-string"
    AcsEndpoint         = "https://${jsondecode(azapi_resource.my_communicationservice.output).properties.hostName}"
    AcsSender           = jsondecode(azapi_resource.mydomain.output).properties.fromSenderDomain
  }

  identity {
    type = "SystemAssigned"
  }
}

resource "azapi_resource" "my_communicationservice" {
  type      = "Microsoft.Communication/communicationServices@2023-04-01-preview"
  name      = "mycommunicationservice-ng1963"
  location  = "global"
  parent_id = azurerm_resource_group.my_rg.id

  body = jsonencode({
    properties = {
      dataLocation = "United States"
      linkedDomains = [
        azapi_resource.mydomain.id
      ]
    }
  })

  response_export_values = ["properties.hostName"]
}

resource "azurerm_email_communication_service" "my_acs_emailservice" {
  name                = "nateisthename-emailcommunicationservice"
  resource_group_name = azurerm_resource_group.my_rg.name
  data_location       = "United States"
}

resource "azapi_resource" "mydomain" {
  type      = "Microsoft.Communication/emailServices/domains@2023-04-01-preview"
  name      = "AzureManagedDomain"
  location  = "global"
  parent_id = azurerm_email_communication_service.my_acs_emailservice.id
  body = jsonencode({
    properties = {
      domainManagement       = "AzureManaged"
      userEngagementTracking = "Disabled"
    }
  })

  response_export_values = ["properties.fromSenderDomain"]
}

data "azurerm_key_vault" "general_secrets" {
  name                = "nateisthenamesecrets"
  resource_group_name = "tfstateresources"
}

resource "azurerm_key_vault" "my_key_vault" {
  name                        = "mykeyvault-reservations"
  location                    = azurerm_resource_group.my_rg.location
  resource_group_name         = azurerm_resource_group.my_rg.name
  enabled_for_disk_encryption = true
  tenant_id                   = var.tenant_id
  soft_delete_retention_days  = 7
  purge_protection_enabled    = false
  enable_rbac_authorization   = true

  sku_name = "standard"
}

data "azurerm_key_vault_secret" "captcha_site_key" {
  name         = "ReservationsCaptchaSecretKey"
  key_vault_id = data.azurerm_key_vault.general_secrets.id
}

resource "azurerm_key_vault_secret" "captcha_site_key" {
  name         = "captcha-secret"
  key_vault_id = azurerm_key_vault.my_key_vault.id
  value        = data.azurerm_key_vault_secret.captcha_site_key.value
}

/* resource "azurerm_key_vault_secret" "acs" {
  name         = "acs-connection-string"
  value        = azurerm_communication_service.my_acs.primary_connection_string
  key_vault_id = azurerm_key_vault.my_key_vault.id
} */

resource "azurerm_role_assignment" "fa_role_assignment" {
  scope                = azurerm_key_vault.my_key_vault.id
  principal_id         = azurerm_linux_function_app.reservations_function_app.identity[0].principal_id
  role_definition_name = "Key Vault Secrets User"
}
