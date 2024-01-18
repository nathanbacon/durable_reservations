using System.Text.Json.Serialization;

namespace nateisthe.name.Function;

class CaptchaValidateRequest
{
  [JsonPropertyName("secret")]
  public string Secret { get; set; }
  [JsonPropertyName("response")]
  public string Response { get; set; }
  [JsonPropertyName("remoteip")]
  public string RemoteIp { get; set; }
}
