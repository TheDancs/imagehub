using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ImageHubService.Domain.Entities
{
    public class UserRelationship
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        [Required]
        public string UserId1 { get; set; }
        [Required]
        public string UserId2 { get; set; }

        [ForeignKey("UserId1")]
        public User User1 { get; set; }

        [ForeignKey("UserId2")]
        public User User2 { get; set; }
    }
}
