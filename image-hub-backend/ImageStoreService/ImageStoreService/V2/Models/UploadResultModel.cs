namespace ImageHubService.V2.Models
{
    public class UploadResultModel
    {
        public bool IsSuccess { get; set; }
        public string ImageId { get; set; }
        public int ErrorCode { get; set; }
    }
}
