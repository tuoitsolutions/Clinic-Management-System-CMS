using ddt_server.Models;
using DeliveryRoomWatcher.Models.Common;
using FluentFTP;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;

namespace ddt_server.Hooks
{
    public class UseFtp
    {

        public static string GetFtpFile(string file_path, string ftp_url, string username, string password)
        {
            var files = new List<FtpModel>();

            FtpClient client = new FtpClient(ftp_url, username, password);
            client.Connect();

            foreach (FtpListItem item in client.GetListing(file_path))
            {
                if (item.Type == FtpFileSystemObjectType.File)
                {
                    files.Add(new FtpModel
                    {
                        file_name = item.Name,
                        modified_time = client.GetModifiedTime(item.FullName),
                        file_path = "ftp://" + ftp_url + item.FullName,
                    });
                }
            }

            if (files.Count > 0)
            {
                return files[0].file_path;
            }
            return "";
        }


        public static byte[] DownloadFtp(string ftp_path, string username, string password)
        {

            try
            {
                var request = new WebClient();
                request.Credentials = new NetworkCredential(username, password);
                var byte_file = request.DownloadData("ftp://" + ftp_path);
                return byte_file;
            }
            catch (Exception e)
            {
                return null;
            }
        }

        public static byte[] DownloadFtp(string file_path, string ftp_path, string username, string password)
        {
            try
            {
                var request = new WebClient();
                request.Credentials = new NetworkCredential(username, password);
                var byte_file = request.DownloadData(file_path + ftp_path);
                return byte_file;
            }
            catch (Exception e)
            {
                return null;
            }
        }

        public static FileResponseModel UploadToFtp(IFormFile file, string ftp_base_url, string file_dest_path, string username, string password)
        {
            try
            {
                if (file != null)
                {
                    string root_file_name = Path.GetFileName(file.FileName);
                    string ext = Path.GetExtension(root_file_name);

                    string unique_file_name = Path.GetFileNameWithoutExtension(root_file_name)
                              + "_"
                              + Guid.NewGuid().ToString().Substring(0, 4)
                              + ext;



                    string root_dir = "ftp://" + ftp_base_url + file_dest_path;

                    bool root_dir_exists = CreateFTPDirectory(root_dir, username, password);

                    if (root_dir_exists)
                    {
                        FtpWebRequest request = (FtpWebRequest)WebRequest.Create(new Uri(root_dir + "/" + unique_file_name));
                        request.Method = WebRequestMethods.Ftp.UploadFile;
                        request.UsePassive = false;
                        request.Credentials = new NetworkCredential(username, password);


                        using (Stream ftpStream = request.GetRequestStream())
                        {
                            file.CopyTo(ftpStream);
                        }


                        return new FileResponseModel
                        {
                            success = true,
                            data = new FileModel
                            {
                                name = unique_file_name,
                                path = file_dest_path + unique_file_name,
                                ext = ext
                            }
                        };
                    }
                    else
                    {
                        return new FileResponseModel
                        {
                            success = false,
                            message = "Unable to create the specified directory. Please make sure that the file URI is correct!"
                        };
                    }


                }


                return new FileResponseModel
                {
                    success = false,
                    message = "The file cannot be null"
                };
            }
            catch (Exception e)
            {
                return new FileResponseModel
                {
                    success = false,
                    message = e.Message
                };
            }
        }

        public static FileResponseModel UploadFtp(IFormFile file, string ftp_path, string username, string password)
        {
            try
            {
                if (file != null)
                {
                    string root_file_name = Path.GetFileName(file.FileName);
                    string ext = Path.GetExtension(root_file_name);

                    string unique_file_name = Path.GetFileNameWithoutExtension(root_file_name)
                              + "_"
                              + Guid.NewGuid().ToString().Substring(0, 4)
                              + ext;



                    string root_dir = "ftp://" + ftp_path;

                    bool root_dir_exists = CreateFTPDirectory(root_dir, username, password);

                    if (root_dir_exists)
                    {
                        FtpWebRequest request = (FtpWebRequest)WebRequest.Create(new Uri(root_dir + "/" + unique_file_name));
                        request.Method = WebRequestMethods.Ftp.UploadFile;
                        request.UsePassive = false;
                        request.Credentials = new NetworkCredential(username, password);


                        using (Stream ftpStream = request.GetRequestStream())
                        {
                            file.CopyTo(ftpStream);
                        }


                        return new FileResponseModel
                        {
                            success = true,
                            data = new FileModel
                            {
                                name = unique_file_name,
                                path = ftp_path + unique_file_name,
                                ext = ext
                            }
                        };
                    }
                    else
                    {
                        return new FileResponseModel
                        {
                            success = false,
                            message = "Unable to create the specified directory. Please make sure that the file URI is correct!"
                        };
                    }


                }


                return new FileResponseModel
                {
                    success = false,
                    message = "The file cannot be null"
                };
            }
            catch (Exception e)
            {
                return new FileResponseModel
                {
                    success = false,
                    message = e.Message
                };
            }
        }


        public static FileResponseModel UploadFtp(IFormFile file, string file_folder_path, string ftp_path, string username, string password)
        {
            try
            {
                if (file != null)
                {
                    string root_file_name = Path.GetFileName(file.FileName);
                    string ext = Path.GetExtension(root_file_name);

                    string unique_file_name = Path.GetFileNameWithoutExtension(root_file_name)
                              + "_"
                              + Guid.NewGuid().ToString().Substring(0, 4)
                              + ext;


                    bool root_dir_exists = CreateFTPDirectory(ftp_path, username, password);

                    string full_file_path = file_folder_path + unique_file_name;


                    if (root_dir_exists)
                    {
                        FtpWebRequest request = (FtpWebRequest)WebRequest.Create(new Uri(ftp_path + full_file_path));
                        request.Method = WebRequestMethods.Ftp.UploadFile;
                        request.UsePassive = false;
                        request.Credentials = new NetworkCredential(username, password);


                        using (Stream ftpStream = request.GetRequestStream())
                        {
                            file.CopyTo(ftpStream);
                        }


                        return new FileResponseModel
                        {
                            success = true,
                            data = new FileModel
                            {
                                name = unique_file_name,
                                path = full_file_path,
                                ext = ext
                            }
                        };
                    }
                    else
                    {
                        return new FileResponseModel
                        {
                            success = false,
                            message = "Unable to create the specified directory. Please make sure that the file URI is correct!"
                        };
                    }


                }


                return new FileResponseModel
                {
                    success = false,
                    message = "The file cannot be null"
                };
            }
            catch (Exception e)
            {
                return new FileResponseModel
                {
                    success = false,
                    message = e.Message
                };
            }

        }


        private static bool CreateFTPDirectory(string directory, string username, string password)
        {

            try
            {
                //create the directory
                FtpWebRequest requestDir = (FtpWebRequest)FtpWebRequest.Create(new Uri(directory));
                requestDir.Method = WebRequestMethods.Ftp.MakeDirectory;
                requestDir.Credentials = new NetworkCredential(username, password);
                requestDir.UsePassive = true;
                requestDir.UseBinary = true;
                requestDir.KeepAlive = false;
                FtpWebResponse response = (FtpWebResponse)requestDir.GetResponse();
                Stream ftpStream = response.GetResponseStream();

                ftpStream.Close();
                response.Close();

                return true;
            }
            catch (WebException ex)
            {
                FtpWebResponse response = (FtpWebResponse)ex.Response;
                if (response.StatusCode == FtpStatusCode.ActionNotTakenFileUnavailable)
                {
                    response.Close();
                    return true;
                }
                else
                {
                    response.Close();
                    return false;
                }
            }
        }

    }
}
