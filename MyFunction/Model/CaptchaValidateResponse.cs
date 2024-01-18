using System.Text.Json.Serialization;

public class CaptchaValidateResponse
{
  [JsonPropertyName("success")]
  public bool Success { get; set; }
  [JsonPropertyName("error-codes")]
  public string[] ErrorCodes { get; set; }
  [JsonPropertyName("challenge_ts")]
  public string ChallengeTs { get; set; }
  [JsonPropertyName("hostname")]
  public string HostName { get; set; }
}
