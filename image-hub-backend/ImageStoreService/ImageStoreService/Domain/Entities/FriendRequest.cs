using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ImageHubService.Domain.Entities
{
    public class FriendRequest
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        [Required]
        public string FromId { get; set; }
        [Required]
        public string ToId { get; set; }
        [Required]
        public DateTime Created { get; set; }

        [ForeignKey("FromId")]
        public User From { get; set; }

        [ForeignKey("ToId")]
        public User To { get; set; }
    }
}
