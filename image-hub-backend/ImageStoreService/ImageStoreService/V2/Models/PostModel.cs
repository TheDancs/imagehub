using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ImageHubService.V2.Models
{
    public class PostModel
    {
        public string Id { get; set; }
        public UserMetaModel Uploader { get; set; }
        public string Description { get; set; }
        public string PictureUrl { get; set; }
        public DateTime UploadTime { get; set; }
        public IEnumerable<UserMetaModel> Likes { get; set; }
    }

}
