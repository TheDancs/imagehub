using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ImageHubService.V2.Models
{
    public class FriendRequest
    {
        public string Id { get; set; }
        public From From { get; set; } 
        public DateTime RequestTime { get; set; }
    }

    public class From
    {
        public string Name { get; set; }
        public string Id { get; set; } //fb user id
    }
}
