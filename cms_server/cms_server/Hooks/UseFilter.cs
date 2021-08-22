using claim_form_server.Payloads;
using pos_server.Models;
using System;
using System.Collections.Generic;

namespace DeliveryRoomWatcher.Hooks
{
    public static class UseFilter
    {
        public static string GenerateSortQuery(SortPayload col, string defaultSort)
        {

            List<string> sorts = new List<string>();

            if (!String.IsNullOrWhiteSpace(defaultSort))
            {
                sorts.Add(defaultSort);
            }

            if (!String.IsNullOrWhiteSpace(col.column))
            {
                sorts.Add($" {col.column} {col.direction} ");
            }


            var sortQuery = String.Join(", ", sorts.ToArray());


            if (String.IsNullOrEmpty(sortQuery))
            {
                return "";
            }
            else
            {
                return " ORDER BY " + sortQuery;
            }

        }

        public static string GenerateLimitQuery(int page, int limit)
        {
            return limit == 0 ? "" : $"limit { page * limit  } , { limit + 1} ";
        }

        public static string GenerateSearchEqualOrDefault(string col, string keyword)
        {
            if (col.Trim().Equals("") || keyword.Trim().Equals(""))
            {
                return "";
            }

            return $" AND {col} = if({keyword} = '',{col},{keyword})";
        }

        public static string GenerateSearchEqualOrDefault(string start_str, string col, string keyword)
        {
            if (col.Trim().Equals("") || keyword.Trim().Equals(""))
            {
                return "";
            }

            return $" {start_str} {col} = if({keyword} = '',{col},{keyword})";
        }
        public static string GenerateSearchLikeOrDefault(string col, string keyword, string value)
        {
            if (col.Trim().Equals("") || keyword.Trim().Equals(""))
            {
                return "";
            }

            if (value.Equals(""))
            {
                return $"{col} = {col}";
            }
            else
            {
                return $"{col} LIKE CONCAT('%',{keyword},'%')";
            }

        }

        public static string GenerateSearchParams(string col, string searchKey)
        {
            String[] words = searchKey.Trim().Split(' ');
            string whereQuery = "";

            if (words.Length > 0)
            {
                whereQuery = " where ";
            }
            else
            {
                return "";
            }

            for (int i = 0; i < words.Length; i++)
            {

                //whereQuery += $" {col} LIKE '%{words[i]}%' ";
                whereQuery += $" LOCATE('{words[i]}',{col}) ";

                if ((i + 1) < words.Length)
                {
                    whereQuery += " AND ";
                }
            }

            //if(!String.IsNullOrEmpty(whereQuery))
            //{
            //    whereQuery += $" OR {col} LIKE '%{searchKey}%' ";
            //}

            return whereQuery;

        }


        public static string GenTablePagination(SortModel sort, PageModel page)
        {

            if (sort != null && page != null)
            {
                return $" ORDER BY {sort.column} {sort.direction} LIMIT {page.begin}, {page.limit + 1} ";
            }
            else
            {
                return "";
            }

        }

        public static string GenWhereDateClause(string column_name, string sign, DateTime? value)
        {

            if (value != null)
            {
                if (column_name != null && sign != null)
                {
                    string date = ((DateTime)value).ToString("yyyy-MM-dd");


                    string where = $" AND DATE({column_name}) {sign} '{date}' ";

                    return where;
                }
                else
                {
                    return "";
                }
            }
            else
            {
                return "";
            }



        }

        public static string GenWhereDateClause(string concat_first, string column_name, string sign, DateTime? value)
        {

            if (value != null)
            {
                if (column_name != null && sign != null)
                {
                    string date = ((DateTime)value).ToString("yyyy-MM-dd");


                    string where = $" {concat_first} DATE({column_name}) {sign} '{date}' ";

                    return where;
                }
                else
                {
                    return "";
                }
            }
            else
            {
                return "";
            }



        }

        public static string GenWhereNumberClause(string concat_first, string column_name, string sign, int? value)
        {

            if (value != null)
            {
                if (column_name != null && sign != null)
                {


                    string where = $" {concat_first} {column_name} {sign} '{value}' ";

                    return where;
                }
                else
                {
                    return "";
                }
            }
            else
            {
                return "";
            }



        }



        public static string GenWhereTimeClause(string concat_first, string column_name, string sign, DateTime? value)
        {

            if (value != null)
            {
                if (column_name != null && sign != null)
                {
                    string time = ((DateTime)value).ToString("HH:mm:ss");


                    string where = $" {concat_first} TIME({column_name}) {sign} '{time}' ";

                    return where;
                }
                else
                {
                    return "";
                }
            }
            else
            {
                return "";
            }



        }

    }
}
