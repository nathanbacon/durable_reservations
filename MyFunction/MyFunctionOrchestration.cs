using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.DurableTask;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;

namespace nateisthe.name.Function
{
    public class MyFunctionOrchestration
    {
        private readonly IHttpClientFactory _httpClientFactory;
        public MyFunctionOrchestration(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        [FunctionName("MyFunctionOrchestration")]
        public static async Task<List<string>> RunOrchestrator(
            [OrchestrationTrigger] IDurableOrchestrationContext context)
        {
            var captchaResult = context.GetInput<string>();
            var isCaptchaValid = await context.CallActivityAsync<bool>(nameof(ValidateCaptchaAsync), captchaResult);

            // returns ["Hello Tokyo!", "Hello Seattle!", "Hello London!"]
            return new List<string>
            {
                isCaptchaValid ? "valid": "invalid",
            };
        }


        [FunctionName("index")]
        public static IActionResult GetHomePage([HttpTrigger(AuthorizationLevel.Anonymous)] HttpRequest req, ExecutionContext context)
        {
            var path = Path.Combine(context.FunctionAppDirectory, "content", "index.html");
            return new ContentResult
            {
                Content = File.ReadAllText(path),
                ContentType = "text/html",
            };
        }

        [FunctionName(nameof(ValidateCaptchaAsync))]
        public async Task<bool> ValidateCaptchaAsync([ActivityTrigger] string captchaResult, ILogger log)
        {
            var captchaSecretKey = Environment.GetEnvironmentVariable("CaptchaSecretKey");
            var client = _httpClientFactory.CreateClient();
            var uri = new Uri(string.Format($"https://www.google.com/recaptcha/api/siteverify?secret={captchaSecretKey}&response={captchaResult}"));

            var response = await client.GetAsync(uri);
            var captchaValidateResponse = await response.Content.ReadFromJsonAsync<CaptchaValidateResponse>();

            return captchaValidateResponse.Success;
        }

        [FunctionName(nameof(SayHello))]
        public static string SayHello([ActivityTrigger] string name, ILogger log)
        {
            log.LogInformation("Saying hello to {name}.", name);
            return $"Hello {name}!";
        }

        [FunctionName("MyFunctionOrchestration_HttpStart")]
        public static async Task<HttpResponseMessage> HttpStart(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequestMessage req,
            [DurableClient] IDurableOrchestrationClient starter,
            ILogger log)
        {
            var captchaResponse = await req.Content.ReadFromJsonAsync<string>();
            // Function input comes from the request content.
            string instanceId = await starter.StartNewAsync<string>("MyFunctionOrchestration", captchaResponse);

            log.LogInformation("Started orchestration with ID = '{instanceId}'.", instanceId);

            return starter.CreateCheckStatusResponse(req, instanceId);
        }
    }
}
