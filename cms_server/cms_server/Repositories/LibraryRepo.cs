using Dapper;
using DeliveryRoomWatcher.Config;
using DeliveryRoomWatcher.Models.Common;
using MySql.Data.MySqlClient;
using pos_server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace cms_server.Repositories
{
    public class LibraryRepo
    {

        public ResponseModel RegionOptions()
        {
            using var con = new MySqlConnection(DatabaseConfig.GetConnection());
            con.Open();
            using var tran = con.BeginTransaction();
            try
            {
                var data = con.Query<OptionModel>($@"
                                       SELECT regioncode AS id , regiondesc AS label FROM `region`
                                    ",
                           null, transaction: tran).ToList();
                return new ResponseModel
                {
                    success = true,
                    data = data
                };
            }
            catch (Exception err)
            {
                return new ResponseModel
                {
                    success = false,
                    message = "The process has been terminated. Error Message: " + err.Message
                };
            }
        }
        public ResponseModel ProvinceOptions(string regioncode)
        {
            using var con = new MySqlConnection(DatabaseConfig.GetConnection());
            con.Open();
            using var tran = con.BeginTransaction();
            try
            {
                var data = con.Query<OptionModel>($@"
                                      SELECT provincecode AS id , provincedesc AS label FROM `province` where regioncode=@regioncode;
                                    ",
                           new { regioncode }, transaction: tran).ToList();
                return new ResponseModel
                {
                    success = true,
                    data = data
                };
            }
            catch (Exception err)
            {
                return new ResponseModel
                {
                    success = false,
                    message = "The process has been terminated. Error Message: " + err.Message
                };
            }

        }
        public ResponseModel CityMunOptions(string provincecode)
        {
            using var con = new MySqlConnection(DatabaseConfig.GetConnection());
            con.Open();
            using var tran = con.BeginTransaction();
            try
            {
                var data = con.Query<OptionModel>($@"
                                      SELECT citymuncode AS id , citymundesc AS label FROM `citymunicipality` where provincecode=@provincecode;
                                    ",
                           new { provincecode }, transaction: tran).ToList();
                return new ResponseModel
                {
                    success = true,
                    data = data
                };
            }
            catch (Exception err)
            {
                return new ResponseModel
                {
                    success = false,
                    message = "The process has been terminated. Error Message: " + err.Message
                };
            }

        }
        public ResponseModel BarangayOptions(string citymuncode)
        {
            using var con = new MySqlConnection(DatabaseConfig.GetConnection());
            con.Open();
            using var tran = con.BeginTransaction();
            try
            {
                var data = con.Query<OptionModel>($@"
                                      SELECT barangaycode AS id , barangaydesc AS label FROM `barangay` where citymuncode=@citymuncode;
                                    ",
                           new { citymuncode }, transaction: tran).ToList();
                return new ResponseModel
                {
                    success = true,
                    data = data
                };
            }
            catch (Exception err)
            {
                return new ResponseModel
                {
                    success = false,
                    message = "The process has been terminated. Error Message: " + err.Message
                };
            }

        }
        public ResponseModel NationalityOptions()
        {
            using var con = new MySqlConnection(DatabaseConfig.GetConnection());
            con.Open();
            using var tran = con.BeginTransaction();
            try
            {
                var data = con.Query<OptionModel>($@"
                                      SELECT id,label FROM 
                                        (
                                         SELECT nat_pk AS id, concat(nationality, ' (',country,')') AS label, concat(nationality, ' ',country) nat FROM `nationality` 
                                        ) as tmp_nat
                                    ",
                           null, transaction: tran).ToList();
                return new ResponseModel
                {
                    success = true,
                    data = data
                };
            }
            catch (Exception err)
            {
                return new ResponseModel
                {
                    success = false,
                    message = "The process has been terminated. Error Message: " + err.Message
                };
            }

        }
        public ResponseModel DoctorSpecialtyOptions()
        {
            using (var con = new MySqlConnection(DatabaseConfig.GetConnection()))
            {
                con.Open();
                using (var tran = con.BeginTransaction())
                {
                    try
                    {
                        var data = con.Query($@"
                                     SELECT spclcode id, spcldesc label FROM `docspecialtymaster` ORDER BY spcldesc ASC
                                    ",
                                   null, transaction: tran).ToList();
                        return new ResponseModel
                        {
                            success = true,
                            data = data
                        };
                    }
                    catch (Exception err)
                    {
                        return new ResponseModel
                        {
                            success = false,
                            message = "The process has been terminated. Error Message: " + err.Message
                        };
                    }

                }
            }

        }
        public ResponseModel ReligionOptions()
        {
            using (var con = new MySqlConnection(DatabaseConfig.GetConnection()))
            {
                con.Open();
                using (var tran = con.BeginTransaction())
                {
                    try
                    {
                        var data = con.Query($@"
                                     SELECT id,label FROM 
                                        (
                                         SELECT rel_pk as id, trim(CONCAT(description, ' (',religion,')')) as label, CONCAT(description,' ',religion) as rel from `religion`
                                        ) as tmp_rel
                                    ",
                                   null, transaction: tran).ToList();
                        return new ResponseModel
                        {
                            success = true,
                            data = data
                        };
                    }
                    catch (Exception err)
                    {
                        return new ResponseModel
                        {
                            success = false,
                            message = "The process has been terminated. Error Message: " + err.Message
                        };
                    }

                }
            }

        }

    }
}
