using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ImageStoreService.Domain.Entities
{
    public class ImageEntity
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string UploaderId { get; set; }
        public string ImageBase64 { get; set; }
        public string ContentType { get; set; }
        public string FileName { get; set; }
    }
}
