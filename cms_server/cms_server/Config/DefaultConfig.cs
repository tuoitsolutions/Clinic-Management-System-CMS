using DeliveryRoomWatcher.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ddt_server.Config
{
    public static class DefaultConfig
    {

        public static string app_name;

        public static string _providerEmailAddress;
        public static string _providerEmailPass;
        public static string _clientBaseUrl;

        public static string ftp_ip;
        public static string ftp_user;
        public static string ftp_pass;


        public static string paymongo_secret_key;
        public static string paymongo_public_key;
        public static string paymongo_payment_url;
        public static string paymongo_source_url;
        public static string paymongo_pay_intent_url;


    }
}
