using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace cms_server.Config
{
    public static class UserConfig
    {
        public static UserRoles USER_ROLES = new UserRoles()
        {
            ADMIN = "admin",
            HOSP_RESIDENT = "hosp_resident"
        };

        public static bool IsUserRole(string user_role, string user_type)
        {
            if (String.Equals(user_role, user_type, StringComparison.OrdinalIgnoreCase))
            {
                return true;
            }
            return false;
        }

        public static bool IsAdmin(string user_type)
        {
            if (String.Equals(USER_ROLES.ADMIN, user_type, StringComparison.OrdinalIgnoreCase))
            {
                return true;
            }
            return false;
        }

        public static bool IsHospResident(string user_type)
        {
            if (String.Equals(USER_ROLES.HOSP_RESIDENT, user_type, StringComparison.OrdinalIgnoreCase))
            {
                return true;
            }
            return false;
        }

        public class UserRoles
        {
            public string ADMIN { get; set; }
            public string HOSP_RESIDENT { get; set; }
        }
    }
}
