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

resource "azurerm_resource_group" "my_rg" {
  name     = "reservations-resources"
  location = "West US"
}
