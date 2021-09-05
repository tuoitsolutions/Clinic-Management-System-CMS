using claim_form_server.Models;
using claim_form_server.Payloads;
using DeliveryRoomWatcher.Models.Common;
using DeliveryRoomWatcher.Providers;
using DeliveryRoomWatcher.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Net.Http.Headers;
using pos_server.Entities;
using System;
using System.Collections.Generic;
using System.Security.Claims;

namespace DeliveryRoomWatcher.Controllers
{
    [Route("api/[controller]/[action]/{id?}")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IJwtAuthManager _jwtAuthManager;
        UserRepo user_repo = new UserRepo();

        public UserController(IJwtAuthManager jwtAuthManager)
        {
            _jwtAuthManager = jwtAuthManager;
        }

        [HttpGet]
        public IActionResult Start()
        {
            return Ok("The server has started successfully");
        }


        [HttpPost]
        public IActionResult Login(AuthUserPayload payload)
        {
            try
            {
                //payload.physicaladdress = HttpContext.Connection.RemoteIpAddress.ToString();
                UserResponseModel auth_res = user_repo.AuthenticateUser(payload);

                if (auth_res.success)
                {

                    List<UserEntity> user_info = auth_res.data;

                    var claims = new Claim[user_info.Count + 1];
                    for (int i = 0; i < user_info.Count; i++)
                    {
                        claims[i] = new Claim(ClaimTypes.Role, user_info[i].user_type);
                    }

                    claims[user_info.Count] = new Claim(ClaimTypes.Name, user_info[user_info.Count - 1].user_pk);

                    var jwtResult = _jwtAuthManager.GenerateTokens(user_info[user_info.Count - 1].user_pk, claims, DateTime.Now, payload.rememberme);

                    return Ok(new ResponseModel
                    {
                        success = true,
                        data = new
                        {
                            access_token = jwtResult.AccessToken,
                            refresh_token = jwtResult.RefreshToken,
                            rememberme = jwtResult.rememberme
                        }
                    });
                }
                else
                {
                    return Ok(new { success = false, message = "The username and/or password you entered is not correct. Please try again." });
                }
            }
            catch (Exception e)
            {
                return Ok(new { success = false, message = $"It looks like we have encountered a server problem while processing your login information. {e.Message}" });
            }
        }

        [HttpPost]
        public IActionResult RefreshToken([FromBody] RefreshTokenPayload payload)
        {
            try
            {
                var userName = User.Identity.Name;

                if (string.IsNullOrWhiteSpace(payload.RefreshToken))
                {
                    return Unauthorized();
                }

                string access_token = Request.Headers[HeaderNames.Authorization];

                string token = access_token.Split(" ")[1];

                //var accessToken = await HttpContext.GetTokenAsync("Bearer", "access_token");
                var jwtResult = _jwtAuthManager.Refresh(payload.RefreshToken, token, DateTime.Now, payload.rememberme);
                return Ok(new
                {
                    access_token = jwtResult.AccessToken,
                    refresh_token = jwtResult.RefreshToken,
                    rememberme = jwtResult.rememberme
                });
            }
            catch (SecurityTokenException e)
            {
                return Unauthorized(e.Message);
            }
        }


        [HttpGet]
        public IActionResult Logout()
        {
            var UserId = User.Identity.Name;
            _jwtAuthManager.RemoveRefreshTokenByUserId(UserId);

            return Ok();
        }

        [Authorize]
        [HttpPost]
        public IActionResult CurrentUser()
        {
            var username = User.Identity.Name;
            return Ok(user_repo.GetLoggedUser(username));
        }


        [Authorize]
        [HttpPost]
        public IActionResult GetUserResidentDtls()
        {
            var username = User.Identity.Name;
            return Ok(user_repo.GetUserResidentDtls(username));
        }
        [Authorize]
        [HttpPost]
        public IActionResult GetUserResidentPic()
        {
            var username = User.Identity.Name;
            return Ok(user_repo.GetUserResidentPic(username));
        }

        [Authorize]
        [HttpPost]
        public IActionResult GetUserPhoto()
        {
            var username = User.Identity.Name;
            return Ok(user_repo.GetUserPhoto(username));
        }

    }
}
