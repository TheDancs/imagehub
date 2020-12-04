using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ImageHubService.Domain.Entities
{
    public class Post
    {
        public Post()
        {
            Likes = new HashSet<Like>();
        }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        public string Description { get; set; }
        [Required]
        public Guid PictureId { get; set; }
        [Required]
        public DateTime UploadTime { get; set; }

        [Required]
        public string UploaderId { get; set; }

        public ICollection<Like> Likes { get; set; }
    }
}
