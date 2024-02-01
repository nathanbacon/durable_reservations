using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Azure.Communication.Email;
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
        private readonly EmailClient _emailClient;
        public MyFunctionOrchestration(IHttpClientFactory httpClientFactory, EmailClient emailClient)
        {
            _httpClientFactory = httpClientFactory;
            _emailClient = emailClient;
        }

        [FunctionName("MyFunctionOrchestration")]
        public static async Task<List<string>> RunOrchestrator(
            [OrchestrationTrigger] IDurableOrchestrationContext context)
        {
            var captchaResult = context.GetInput<string>();
            var isCaptchaValid = await context.CallActivityAsync<bool>(nameof(ValidateCaptchaAsync), captchaResult);

            if (!isCaptchaValid) return new List<string> { "invalid captcha" };

            context.SetCustomStatus("CAPTCHA_VERIFIED");

            var calendarEvent = context.WaitForExternalEvent<CalendarEvent>("AppointmentRequested", TimeSpan.FromSeconds(90));

            var emailSuccess = await context.CallActivityAsync<bool>(nameof(SendConfirmationEmail), calendarEvent);

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

        [FunctionName("bundle")]
        public static IActionResult GetBundle([HttpTrigger(AuthorizationLevel.Anonymous)] HttpRequest req, ExecutionContext context)
        {
            var path = Path.Combine(context.FunctionAppDirectory, "content", "bundle");
            return new ContentResult
            {
                Content = File.ReadAllText(path),
                ContentType = "text/html",
            };
        }

        [FunctionName(nameof(SendConfirmationEmail))]
        public async Task<bool> SendConfirmationEmail([ActivityTrigger] CalendarEvent calendarEvent, ILogger log)
        {
            var subject = "Hello";
            var htmlContent = @"
                <html>
                    <body>
                        <h1>Hello, world</h1><br/>
                    </body>
                </html>
            ";
            var recipient = calendarEvent.Email;
            var from = Environment.GetEnvironmentVariable("AcsSender");
            var emailOperation = await _emailClient.SendAsync(Azure.WaitUntil.Completed, senderAddress: from, recipientAddress: recipient, subject: subject, htmlContent: htmlContent);
            log.LogInformation("email " + (emailOperation.Value.Status == EmailSendStatus.Succeeded ? "success" : emailOperation.Value.ToString()));
            return emailOperation.Value.Status == EmailSendStatus.Succeeded;
        }

        [FunctionName(nameof(ValidateCaptchaAsync))]
        public async Task<bool> ValidateCaptchaAsync([ActivityTrigger] string captchaResult, ILogger log)
        {
            log.LogInformation("going to validate captcha");
            var captchaSecretKey = Environment.GetEnvironmentVariable("CaptchaSecretKey");
            var client = new HttpClient();
            var uri = new Uri($"https://www.google.com/recaptcha/api/siteverify?secret={captchaSecretKey}&response={captchaResult}");
            log.LogInformation(uri.ToString());

            var response = await client.GetAsync(uri);
            var captchaValidateResponse = await response.Content.ReadFromJsonAsync<CaptchaValidateResponse>();

            if (!captchaValidateResponse.Success)
            {
                log.LogInformation("captcha failed");
                foreach (var error in captchaValidateResponse.ErrorCodes)
                {
                    log.LogError(error);
                }
            }

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
