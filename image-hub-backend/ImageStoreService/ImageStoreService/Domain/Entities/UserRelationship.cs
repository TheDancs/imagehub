using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

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
        public ApplicationUser User1 { get; set; }
        [ForeignKey("UserId2")]
        public ApplicationUser User2 { get; set; }
    }
}
