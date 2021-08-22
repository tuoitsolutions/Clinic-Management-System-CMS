using pos_server.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using static cms_server.Models.PaymongoModel;

namespace DeliveryRoomWatcher.Models.Common
{
    public class ResponseModel
    {
        [Required]
        public bool success { get; set; } = false;
        public object data { get; set; }
        public string message { get; set; }
        public List<string> errors { get; set; }
        public List<PaymongoResouceError> paymongo_errors { get; set; }
        public string file { get; set; }
    }

    public class UserResponseModel
    {
        [Required]
        public bool success { get; set; } = false;
        public List<UserEntity> data { get; set; }
        public string message { get; set; }
    }

    public class FileModel
    {
        public string name { get; set; }
        public string path { get; set; }
        public string ext { get; set; }
    }
    public class FileResponseModel
    {
        [Required]
        public bool success { get; set; } = false;
        public FileModel data { get; set; }
        public string message { get; set; }
    }

    public class ErrorModel
    {
        public string key { get; set; }
        public string value { get; set; }
    }
}
