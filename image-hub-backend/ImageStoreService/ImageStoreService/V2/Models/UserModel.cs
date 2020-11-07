using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ImageHubService.V2.Models
{
    public class UserModel
    {
        public string UserId { get; set; } //fb id
        public string Name { get; set; }
        public string Email { get; set; }
        public IEnumerable<UserMetaModel> Friends { get; set; }
    }
}
