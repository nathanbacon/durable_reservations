terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "3.86.0"
    }
  }

  backend "azurerm" {
    resource_group_name  = "tfstateresources"
    storage_account_name = "ngtfstate21823"
    container_name       = "reservations"
    key                  = "terraform.tfstate"
  }
}

provider "azurerm" {
  features {

  }
}

variable "captcha_site_key" {
  type = string
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


resource "azurerm_linux_function_app" "reservations_function_app" {
  name                = "reservations-function-app"
  resource_group_name = azurerm_resource_group.my_rg.name
  location            = azurerm_resource_group.my_rg.location

  storage_account_name       = azurerm_storage_account.function_storage.name
  storage_account_access_key = azurerm_storage_account.function_storage.primary_access_key
  service_plan_id            = azurerm_service_plan.reservations_functions.id

  site_config {

  }

  app_settings = {
    captcha_site_key = var.captcha_site_key
  }

  identity {
    type = "SystemAssigned"
  }
}

resource "azurerm_key_vault" "my_key_vault" {
  name                        = "mykeyvault-reservations"
  location                    = azurerm_resource_group.my_rg.location
  resource_group_name         = azurerm_resource_group.my_rg.name
  enabled_for_disk_encryption = true
  tenant_id                   = azurerm_linux_function_app.reservations_function_app.identity[0].tenant_id
  soft_delete_retention_days  = 7
  purge_protection_enabled    = false

  sku_name = "standard"

  access_policy {
    tenant_id = azurerm_linux_function_app.reservations_function_app.identity[0].tenant_id
    object_id = azurerm_linux_function_app.reservations_function_app.identity[0].principal_id

    secret_permissions = [
      "Get",
    ]
  }
}
