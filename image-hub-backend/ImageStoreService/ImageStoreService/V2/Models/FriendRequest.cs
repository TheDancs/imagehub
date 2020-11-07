using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ImageHubService.V2.Models
{
    public class FriendRequest
    {
        public string Id { get; set; }
        public UserMetaModel From { get; set; } 
        public DateTime RequestTime { get; set; }
    }
}
