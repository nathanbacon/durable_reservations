using System;
using Azure.Communication.Email;
using Azure.Identity;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.Azure;
using Microsoft.Extensions.DependencyInjection;

[assembly: FunctionsStartup(typeof(nateisthe.name.Function.Startup))]

namespace nateisthe.name.Function
{
  public class Startup : FunctionsStartup
  {
    public override void Configure(IFunctionsHostBuilder builder)
    {
      var acsEndpoint = Environment.GetEnvironmentVariable("AcsEndpoint");
      builder.Services.AddTransient((_) =>
        new EmailClient(new Uri(acsEndpoint), new DefaultAzureCredential())
      );
    }
  }
}
