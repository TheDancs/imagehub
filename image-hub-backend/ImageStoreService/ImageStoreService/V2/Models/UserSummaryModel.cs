using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ImageHubService.V2.Models
{
    public class UserSummaryModel : UserModel
    {
        public int NumberOfFriends { get; set; }
        public int NumberOfPosts { get; set; }
        public bool IsFriend { get; set; }
    }
}
