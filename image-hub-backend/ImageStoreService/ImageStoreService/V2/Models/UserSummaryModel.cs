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

        /// <summary>
        /// 0 not friend, 1 friend, 2 request sent
        /// </summary>
        public int FriendStatus { get; set; }
    }
}
