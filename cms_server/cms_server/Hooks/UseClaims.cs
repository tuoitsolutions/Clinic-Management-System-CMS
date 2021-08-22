using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading.Tasks;

namespace cms_server.Hooks
{
    public class UseClaims
    {
        public static List<string> GetUserRoles(ClaimsIdentity identity)
        {
            var roles = identity.Claims.Where(c => c.Type == (identity).RoleClaimType).ToList();
            var list_roles = new List<string>();
            foreach (var r in roles)
            {
                if (r.Value != null)
                {
                    list_roles.Add(r.Value);
                }
            }
            return list_roles;
        }

        public static bool IsUserClaimHasRole(ClaimsIdentity identity, string role)
        {
            var roles = identity.Claims.Where(c => c.Type == (identity).RoleClaimType).ToList();
            var list_roles = new List<string>();

            bool has_role = false;
            foreach (var r in roles)
            {
                if (r.Value.Equals(role))
                {
                    has_role = true;
                }
            }
            return has_role;
        }

        public static string GetUserType(ClaimsIdentity identity)
        {
            var roles = identity.Claims.Where(c => c.Type == (identity).RoleClaimType).ToList();

            List<string> all_roles = new List<string>() { "admin", "hosp_resident" };

            var list_roles = new List<string>();


            foreach (var ar in all_roles)
            {
                var match = roles.FirstOrDefault(stringToCheck => stringToCheck.Value.Contains(ar));
                if (match != null)
                {
                    return ar;
                }
            }

            return "";
        }
    }
}
