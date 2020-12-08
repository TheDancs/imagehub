using System;

namespace ImageHubService.V2.Models
{
    public class PostModel
    {
        public string Id { get; set; }
        public UserMetaModel Uploader { get; set; }
        public string Description { get; set; }
        public string PictureUrl { get; set; }
        public DateTime UploadTime { get; set; }
        public int Likes { get; set; }
    }

}
