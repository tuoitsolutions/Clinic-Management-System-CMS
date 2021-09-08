using cms_server.EmailTemplates;
using cms_server.Entities;
using cms_server.Hooks;
using Dapper;
using ddt_server.Config;
using DeliveryRoomWatcher.Config;
using DeliveryRoomWatcher.Hooks;
using DeliveryRoomWatcher.Models.Common;
using MySql.Data.MySqlClient;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using static cms_server.Models.PaymongoModel;
using static cms_server.Payloads.PaymongoPayloads;

namespace cms_server.Repositories
{
    public class PaymongoRepo
    {
        OnlineConsultLinkEmail online_consult_link_email = new OnlineConsultLinkEmail();

        public async Task<ResponseModel> EWalletCreateSourceAsync(PaymongoEwalletPayload payload)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();
                try
                {
                    ConsultRequestEntity consult_info = con.QuerySingle<ConsultRequestEntity>(
                        $@"SELECT *,md5(consult_req_pk) hash_key FROM `consult_request` where consult_req_pk = @consult_req_pk;"
                        , new { payload.consult_req_pk }, transaction: tran);
                    if (consult_info != null)
                    {
                        if (consult_info.pay_at != null || consult_info.paymongo_paid_at != null || !consult_info.sts_pk.Equals("fa"))
                        {
                            return new ResponseModel
                            {
                                success = false,
                                message = "This consultation request has already been marked as paid! Please contact us for inquiries."
                            };
                        }

                        string url = DefaultConfig.paymongo_source_url;
                        string secret_key = DefaultConfig.paymongo_secret_key;
                        var paymongo_payload = new { data = new { attributes = payload } };

                        PaymongoSourceResourceResponse paymongo_response = await UsePaymongoApi.PaymongoFetch(url, secret_key, paymongo_payload);


                        if (paymongo_response.errors != null)
                        {

                            return new ResponseModel
                            {
                                success = false,
                                paymongo_errors = paymongo_response.errors
                            };
                        }

                        if (paymongo_response.errors == null && paymongo_response.data.id != null)
                        {


                            if (paymongo_response.data.attributes.redirect.checkout_url != null)
                            {

                                BillPaymongoEntity bill_paymong_payload = new BillPaymongoEntity
                                {
                                    consult_req_pk = payload.consult_req_pk,
                                    id = paymongo_response.data.id,
                                    event_type = "source.create",
                                    source_type = paymongo_response.data.type,
                                    amount = paymongo_response.data.attributes.amount,
                                    city = paymongo_response.data.attributes.billing.address.city,
                                    country = paymongo_response.data.attributes.billing.address.country,
                                    line1 = paymongo_response.data.attributes.billing.address.line1,
                                    line2 = paymongo_response.data.attributes.billing.address.line2,
                                    postal_code = paymongo_response.data.attributes.billing.address.postal_code,
                                    state = paymongo_response.data.attributes.billing.address.state,
                                    email = paymongo_response.data.attributes.billing.email,
                                    phone = paymongo_response.data.attributes.billing.phone,
                                    currency = paymongo_response.data.attributes.currency,
                                    livemode = paymongo_response.data.attributes.livemode,
                                    checkout_url = paymongo_response.data.attributes.redirect.checkout_url,
                                    failed_url = paymongo_response.data.attributes.redirect.failed,
                                    success_url = paymongo_response.data.attributes.redirect.success,
                                    status = paymongo_response.data.attributes.status,
                                    type = paymongo_response.data.attributes.type,
                                    created_at = paymongo_response.data.attributes.created_at,
                                    updated_at = paymongo_response.data.attributes.updated_at,
                                };

                                int saved_bill_paymongo = con.Execute($@"
                                     INSERT INTO `bill_paymongo` SET 
                                     consult_req_pk=@consult_req_pk,
                                     id=@id,
                                     event_type=@event_type,
                                     source_type=@source_type,
                                     amount=@amount,
                                     city=@city,
                                     country=@country,
                                     line1=@line1,
                                     line2=@line2,
                                     postal_code=@postal_code,
                                     state=@state,
                                     email=@email,
                                     phone=@phone,
                                     currency=@currency,
                                     livemode=@livemode,
                                     checkout_url=@checkout_url,
                                     failed_url=@failed_url,
                                     success_url=@success_url,
                                     status=@status,
                                     type=@type,
                                     created_at=@created_at,
                                     updated_at=@updated_at;
                                    ",
                                  bill_paymong_payload, transaction: tran);

                                if (saved_bill_paymongo > 0)
                                {
                                    if (String.IsNullOrEmpty(consult_info.consult_link_pass) || String.IsNullOrEmpty(consult_info.consult_link_hash))
                                    {
                                        string consult_link_pass = UseOtp.create();
                                        string consult_link_hash = UseHash.Sha256(consult_link_pass);
                                        consult_info.consult_link_pass = consult_link_pass;
                                        consult_info.consult_link_hash = consult_link_hash;
                                    }

                                    consult_info.paymongo_src_id = paymongo_response.data.id;

                                    int update_consult = con.Execute($@"
                                            UPDATE `consult_request` SET
                                            sts_pk='pd',
                                            paymongo_src_id=@paymongo_src_id,
                                            paymongo_src_id_enc_at=NOW(),
                                            consult_link_pass=@consult_link_pass,
                                            consult_link_hash=@consult_link_hash,
                                            consult_link_sent_count=(consult_link_sent_count+1)
                                            WHERE consult_req_pk = @consult_req_pk;"
                                      , consult_info,
                                      transaction: tran);

                                    if (update_consult > 0)
                                    {
                                        ResponseModel email_response = online_consult_link_email.CreateOnlineConsultLinkEmail(consult_info);

                                        if (!email_response.success)
                                        {
                                            return email_response;
                                        }

                                        tran.Commit();
                                        return new ResponseModel
                                        {
                                            success = true,
                                            message = "The payment source has been created succesfully, redirecting to GCash payment authorization.",
                                            data = paymongo_response.data.attributes.redirect.checkout_url
                                        };
                                    }
                                }
                                else
                                {
                                    return new ResponseModel
                                    {
                                        success = false,
                                        message = "The server is not able to save the billing information! Please try again later."
                                    };
                                }

                            }
                            else
                            {
                                return new ResponseModel
                                {
                                    success = false,
                                    message = "No checkout URL has been created in this payment process! Please try again later."
                                };
                            }
                        }

                        return new ResponseModel
                        {
                            success = false,
                            message = "A problem has occured when processing the payment. Please try again later."
                        };
                    }
                    else
                    {
                        return new ResponseModel
                        {
                            success = false,
                            message = "The consultation request that you are trying to pay no longer exist.",
                        };
                    }
                }
                catch (Exception e)
                {
                    return new ResponseModel
                    {
                        success = false,
                        message = $"The server has encountered a problem. {e.Message}",
                    };
                }

            }
            catch (Exception e)
            {
                return new ResponseModel
                {
                    success = false,
                    message = e.Message.ToString()
                };
            }
        }

        public async Task<ResponseModel> EWalletWebHookAsync(PaymongoSourceResourceResponse payload)
        {
            using var con = new MySqlConnection(DatabaseConfig.GetConnection());
            con.Open();
            using var tran = con.BeginTransaction();
            try
            {
                string event_type = payload.data.attributes.type;
                var amount = payload.data.attributes.data.attributes.amount;
                string currency = "PHP";
                string source_resource_id = payload.data.attributes.data.id;
                var type = payload.data.attributes.data.type;

                ConsultRequestEntity selected_consult_req = con.QuerySingle<ConsultRequestEntity>(
                   $@"SELECT * FROM `consult_request` where paymongo_src_id = @paymongo_src_id;"
                   , new { paymongo_src_id = source_resource_id }, transaction: tran);

                var url = DefaultConfig.paymongo_payment_url;
                var secret_key = DefaultConfig.paymongo_secret_key;
                var create_payment_payload = new
                {
                    data = new
                    {
                        attributes = new
                        {
                            amount = Convert.ToInt32(amount),
                            description = $"Online consultation payment for {selected_consult_req.consult_req_pk}",
                            currency = currency,
                            source = new
                            {
                                id = source_resource_id,
                                type = "source"
                            }
                        }
                    }
                };

                PaymongoSourceResourceResponse payment_resource_response = await UsePaymongoApi.PaymongoFetch(url, secret_key, create_payment_payload);

                if (payment_resource_response?.errors == null && event_type.Equals("source.chargeable"))
                {
                    //add notification that the payment has received

                    int updated_consult_req = con.Execute(
                                $@"UPDATE `consult_request` 
                                    SET 
                                    paymongo_charge_at = NOW()
                                    WHERE consult_req_pk = @consult_req_pk; "
                                , new { selected_consult_req.consult_req_pk }
                                , transaction: tran);

                    if (updated_consult_req > 0)
                    {
                        BillPaymongoEntity bill_paymong_payload = new BillPaymongoEntity
                        {
                            consult_req_pk = selected_consult_req?.consult_req_pk,
                            id = payment_resource_response?.data?.id,
                            event_type = event_type,
                            source_type = payment_resource_response?.data?.type,
                            amount = payment_resource_response?.data?.attributes?.amount,
                            city = payment_resource_response?.data?.attributes?.billing?.address?.city,
                            country = payment_resource_response?.data?.attributes?.billing?.address?.country,
                            line1 = payment_resource_response?.data?.attributes?.billing?.address?.line1,
                            line2 = payment_resource_response?.data?.attributes?.billing?.address?.line2,
                            postal_code = payment_resource_response?.data?.attributes?.billing?.address?.postal_code,
                            state = payment_resource_response?.data?.attributes?.billing?.address?.state,
                            email = payment_resource_response?.data?.attributes?.billing?.email,
                            phone = payment_resource_response?.data?.attributes?.billing?.phone,
                            currency = payment_resource_response?.data?.attributes?.currency,
                            livemode = payment_resource_response?.data?.attributes?.livemode,
                            checkout_url = payment_resource_response?.data?.attributes?.redirect?.checkout_url,
                            failed_url = payment_resource_response?.data?.attributes?.redirect?.failed,
                            success_url = payment_resource_response?.data?.attributes?.redirect?.success,
                            status = payment_resource_response?.data?.attributes?.status,
                            type = payment_resource_response?.data?.attributes?.type,
                            created_at = payment_resource_response?.data?.attributes?.created_at,
                            updated_at = payment_resource_response?.data?.attributes?.updated_at,
                            paid_at = payment_resource_response?.data?.attributes?.paid_at,
                            fee = payment_resource_response?.data?.attributes?.fee,
                            pay_descrip = payment_resource_response?.data?.attributes?.description,
                            pay_net_amount = payment_resource_response?.data?.attributes?.net_amount,
                            pay_payout = payment_resource_response?.data?.attributes?.payout,
                            pay_src_id = payment_resource_response?.data?.attributes?.source?.id,
                            pay_src_type = payment_resource_response?.data?.attributes?.source?.type,
                            pay_statement_descrip = payment_resource_response?.data?.attributes?.statement_descriptor,
                        };

                        int saved_bill_paymongo = con.Execute($@"
                                     INSERT INTO `bill_paymongo` SET 
                                     consult_req_pk=@consult_req_pk,
                                     id=@id,
                                     event_type=@event_type,
                                     source_type=@source_type,
                                     amount=@amount,
                                     city=@city,
                                     country=@country,
                                     line1=@line1,
                                     line2=@line2,
                                     postal_code=@postal_code,
                                     state=@state,
                                     email=@email,
                                     phone=@phone,
                                     currency=@currency,
                                     livemode=@livemode,
                                     checkout_url=@checkout_url,
                                     failed_url=@failed_url,
                                     success_url=@success_url,
                                     status=@status,
                                     type=@type,
                                     created_at=@created_at,
                                     updated_at=@updated_at,
                                     paid_at=@paid_at,
                                     fee=@fee,
                                     pay_descrip=@pay_descrip,
                                     pay_net_amount=@pay_net_amount,
                                     pay_payout=@pay_payout,
                                     pay_src_id=@pay_src_id,
                                     pay_src_type=@pay_src_type,
                                     pay_statement_descrip=@pay_statement_descrip;",
                          bill_paymong_payload, transaction: tran);


                        if (saved_bill_paymongo > 0)
                        {
                            tran.Commit();
                            return new ResponseModel
                            {
                                success = true,
                                message = "success",
                            };
                        }
                    }

                }

                return new ResponseModel
                {
                    success = false,
                };
            }
            catch (Exception e)
            {
                return new ResponseModel
                {
                    success = false,
                };
            }
        }

        public ResponseModel EWalletPaidWebHook(PaymongoSourceResourceResponse payload)
        {
            using var con = new MySqlConnection(DatabaseConfig.GetConnection());
            con.Open();
            using var tran = con.BeginTransaction();
            try
            {
                var amount = payload.data.attributes.data.attributes.amount;
                string payment_intent_id = payload.data?.attributes?.data?.attributes?.payment_intent_id;
                string source_resource_id = payload.data?.attributes?.data?.attributes?.source?.id;
                var type = payload.data.attributes.data.type;
                string event_type = payload?.data?.attributes?.type;

                if (event_type.Equals("payment.paid"))
                {
                    bool is_card_payment = payment_intent_id != null ? true : false;
                    string transac_id = payment_intent_id != null ? payment_intent_id : source_resource_id;

                    List<string> src_ids = new List<string>();

                    if (payment_intent_id != null)
                    {
                        src_ids.Add(payment_intent_id);
                    }
                    if (source_resource_id != null)
                    {
                        src_ids.Add(source_resource_id);
                    }

                    ConsultRequestEntity selected_consult_req = con.QuerySingle<ConsultRequestEntity>(
                    $@"SELECT * FROM `consult_request` where paymongo_src_id IN @paymongo_src_id;"
                    , new { paymongo_src_id = src_ids }, transaction: tran);


                    int updated_consult_req = con.Execute(
                                $@"UPDATE `consult_request` 
                                    SET 
                                    paymongo_paid_at = NOW(),
                                    pay_at = NOW(),
                                    sts_pk = 'pd'
                                    WHERE consult_req_pk = @consult_req_pk; "
                                , new { selected_consult_req.consult_req_pk }
                                , transaction: tran);

                    if (updated_consult_req > 0)
                    {
                        BillPaymongoEntity bill_paymong_payload = new BillPaymongoEntity
                        {
                            consult_req_pk = selected_consult_req?.consult_req_pk,
                            event_type = event_type,
                            id = payload?.data?.id,
                            source_type = payload?.data?.type,
                            amount = payload?.data?.attributes?.data?.attributes?.amount,
                            city = payload?.data?.attributes?.data?.attributes?.billing?.address?.city,
                            country = payload?.data?.attributes?.data?.attributes?.billing?.address?.country,
                            line1 = payload?.data?.attributes?.data?.attributes?.billing?.address?.line1,
                            line2 = payload?.data?.attributes?.data?.attributes?.billing?.address?.line2,
                            postal_code = payload?.data?.attributes?.data?.attributes?.billing?.address?.postal_code,
                            state = payload?.data?.attributes?.data?.attributes?.billing?.address?.state,
                            email = payload?.data?.attributes?.data?.attributes?.billing?.email,
                            phone = payload?.data?.attributes?.data?.attributes?.billing?.phone,
                            currency = payload?.data?.attributes?.data?.attributes?.currency,
                            livemode = payload?.data?.attributes?.data?.attributes?.livemode,
                            status = payload?.data?.attributes?.data?.attributes?.status,
                            type = payload?.data?.attributes?.data?.attributes?.type,
                            created_at = payload?.data?.attributes?.data?.attributes?.created_at,
                            updated_at = payload?.data?.attributes?.data?.attributes?.updated_at,
                            paid_at = payload?.data?.attributes?.data?.attributes?.paid_at,
                            available_at = payload?.data?.attributes?.data?.attributes?.available_at,
                            fee = payload?.data?.attributes?.data?.attributes?.fee,
                            pay_descrip = payload?.data?.attributes?.data?.attributes?.description,
                            pay_net_amount = payload?.data?.attributes?.data?.attributes?.net_amount,
                            pay_payout = payload?.data?.attributes?.data?.attributes?.payout,
                            pay_src_id = payload?.data?.attributes?.data?.id,
                            pay_src_type = payload?.data?.attributes?.data?.type,
                            pay_statement_descrip = payload?.data?.attributes?.data?.attributes?.statement_descriptor,
                            card_src_id = payload?.data.attributes?.data?.attributes?.source?.id,
                            card_src_type = payload?.data.attributes?.data?.attributes?.source?.type,
                            card_src_brand = payload?.data.attributes?.data?.attributes?.source?.brand,
                            card_src_country = payload?.data.attributes?.data?.attributes?.source?.country,
                            card_src_last4 = payload?.data.attributes?.data?.attributes?.source?.last4,
                        };

                        int saved_bill_paymongo = con.Execute($@"
                                     INSERT INTO `bill_paymongo` SET 
                                     consult_req_pk=@consult_req_pk,
                                     id=@id,
                                     event_type=@event_type,
                                     source_type=@source_type,
                                     amount=@amount,
                                     city=@city,
                                     country=@country,
                                     line1=@line1,
                                     line2=@line2,
                                     postal_code=@postal_code,
                                     state=@state,
                                     email=@email,
                                     phone=@phone,
                                     currency=@currency,
                                     livemode=@livemode,
                                     checkout_url=@checkout_url,
                                     failed_url=@failed_url,
                                     success_url=@success_url,
                                     status=@status,
                                     type=@type,
                                     created_at=@created_at,
                                     updated_at=@updated_at,
                                     paid_at=@paid_at,
                                     fee=@fee,
                                     pay_descrip=@pay_descrip,
                                     pay_net_amount=@pay_net_amount,
                                     pay_payout=@pay_payout,
                                     pay_src_id=@pay_src_id,
                                     pay_src_type=@pay_src_type,
                                     card_src_id=@card_src_id,
                                     card_src_type=@card_src_type,
                                     card_src_brand=@card_src_brand,
                                     card_src_country=@card_src_country,
                                     card_src_last4=@card_src_last4,
                                     pay_statement_descrip=@pay_statement_descrip;",
                          bill_paymong_payload, transaction: tran);

                        if (saved_bill_paymongo > 0)
                        {
                            tran.Commit();
                            return new ResponseModel
                            {
                                success = true,
                                message = "success",
                            };
                        }
                    }

                }


                return new ResponseModel
                {
                    success = false,
                };
            }
            catch (Exception e)
            {
                return new ResponseModel
                {
                    success = false,
                };
            }
        }

        //CARD PAYMENT

        public async Task<ResponseModel> CreatePaymentIntentAsync(PaymongoEwalletPayload payload)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();
                try
                {
                    ConsultRequestEntity consult_info = con.QuerySingle<ConsultRequestEntity>(
                        $@"SELECT *,md5(consult_req_pk) hash_key FROM `consult_request` where consult_req_pk = @consult_req_pk;"
                        , new { payload.consult_req_pk }, transaction: tran);

                    if (consult_info != null)
                    {
                        if (consult_info.pay_at != null || consult_info.paymongo_paid_at != null || !consult_info.sts_pk.Equals("fa"))
                        {
                            return new ResponseModel
                            {
                                success = false,
                                message = "This consultation request has already been marked as paid! Please contact us for inquiries."
                            };
                        }

                        var url = DefaultConfig.paymongo_pay_intent_url;
                        var secret_key = DefaultConfig.paymongo_secret_key;
                        var form_data = new
                        {
                            data = new
                            {
                                attributes = payload
                            }
                        };

                        PaymongoSourceResourceResponse paymongo_response = await UsePaymongoApi.PaymongoFetch(url, secret_key, form_data);

                        if (paymongo_response.errors != null)
                        {

                            return new ResponseModel
                            {
                                success = false,
                                paymongo_errors = paymongo_response.errors
                            };
                        }

                        if (paymongo_response.errors == null && paymongo_response.data.id != null)
                        {



                            if (paymongo_response.data.attributes.client_key != null)
                            {
                                BillPaymongoEntity bill_paymong_payload = new BillPaymongoEntity
                                {
                                    consult_req_pk = payload?.consult_req_pk,
                                    id = paymongo_response?.data?.id,
                                    event_type = "source.create",
                                    source_type = paymongo_response?.data?.type,
                                    amount = paymongo_response?.data?.attributes?.amount,
                                    city = paymongo_response?.data?.attributes?.billing?.address?.city,
                                    country = paymongo_response?.data?.attributes?.billing?.address?.country,
                                    line1 = paymongo_response?.data?.attributes?.billing?.address?.line1,
                                    line2 = paymongo_response?.data?.attributes?.billing?.address?.line2,
                                    postal_code = paymongo_response?.data?.attributes?.billing?.address?.postal_code,
                                    state = paymongo_response?.data?.attributes?.billing?.address?.state,
                                    email = paymongo_response?.data?.attributes?.billing?.email,
                                    phone = paymongo_response?.data?.attributes?.billing?.phone,
                                    currency = paymongo_response?.data?.attributes?.currency,
                                    livemode = paymongo_response?.data?.attributes?.livemode,
                                    checkout_url = paymongo_response?.data?.attributes?.redirect?.checkout_url,
                                    failed_url = paymongo_response?.data?.attributes?.redirect?.failed,
                                    success_url = paymongo_response?.data?.attributes?.redirect?.success,
                                    status = paymongo_response?.data?.attributes?.status,
                                    type = paymongo_response?.data?.attributes?.type,
                                    created_at = paymongo_response?.data?.attributes?.created_at,
                                    updated_at = paymongo_response?.data?.attributes?.updated_at,
                                    client_key = paymongo_response?.data?.attributes?.client_key,
                                };

                                int saved_bill_paymongo = con.Execute($@"
                                         INSERT INTO `bill_paymongo` SET 
                                         consult_req_pk=@consult_req_pk,
                                         id=@id,
                                         client_key=@client_key,
                                         event_type=@event_type,
                                         source_type=@source_type,
                                         amount=@amount,
                                         currency=@currency,
                                         livemode=@livemode,
                                         failed_url=@failed_url,
                                         success_url=@success_url,
                                         status=@status,
                                         type=@type,
                                         created_at=@created_at,
                                         updated_at=@updated_at;
                                        ",
                                  bill_paymong_payload, transaction: tran);

                                if (saved_bill_paymongo > 0)
                                {

                                    if (String.IsNullOrEmpty(consult_info.consult_link_pass) || String.IsNullOrEmpty(consult_info.consult_link_hash))
                                    {
                                        string consult_link_pass = UseOtp.create();
                                        string consult_link_hash = UseHash.Sha256(consult_link_pass);
                                        consult_info.consult_link_pass = consult_link_pass;
                                        consult_info.consult_link_hash = consult_link_hash;
                                    }

                                    consult_info.paymongo_src_id = paymongo_response.data.id;

                                    int update_consult = con.Execute($@"
                                            UPDATE `consult_request` SET
                                            sts_pk='pd',
                                            paymongo_src_id=@paymongo_src_id,
                                            paymongo_src_id_enc_at=NOW(),
                                            consult_link_pass=@consult_link_pass,
                                            consult_link_hash=@consult_link_hash,
                                            consult_link_sent_count=(consult_link_sent_count+1)
                                            WHERE consult_req_pk = @consult_req_pk;"
                                      , consult_info,
                                      transaction: tran);

                                    if (update_consult > 0)
                                    {
                                        ResponseModel email_response = online_consult_link_email.CreateOnlineConsultLinkEmail(consult_info);

                                        if (!email_response.success)
                                        {
                                            return email_response;
                                        }

                                        tran.Commit();
                                        paymongo_response.data.public_key = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{secret_key}:"));
                                        return new ResponseModel
                                        {
                                            success = true,
                                            message = "The payment source has been created succesfully, redirecting to GCash payment authorization.",
                                            data = paymongo_response.data
                                        };
                                    }
                                }
                                else
                                {
                                    return new ResponseModel
                                    {
                                        success = false,
                                        message = "The server is not able to save the billing information! Please try again later."
                                    };
                                }
                            }
                            else
                            {
                                return new ResponseModel
                                {
                                    success = false,
                                    message = "No checkout URL has been created in this payment process! Please try again later."
                                };
                            }
                        }

                        return new ResponseModel
                        {
                            success = false,
                            message = "A problem has occured when processing the payment. Please try again later."
                        };
                    }
                    else
                    {
                        return new ResponseModel
                        {
                            success = false,
                            message = "The consultation request that you are trying to pay no longer exist.",
                        };
                    }
                }
                catch (Exception e)
                {
                    return new ResponseModel
                    {
                        success = false,
                        message = $"The server has encountered a problem. {e.Message}",
                    };
                }

            }
            catch (Exception e)
            {
                return new ResponseModel
                {
                    success = false,
                    message = e.Message.ToString()
                };
            }
        }


        //RECORDS

        public ResponseModel GetTablePaymongoLog(PaymongoTablePayload payload)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();
                List<BillPaymongoEntity> table_data = con.Query<BillPaymongoEntity>($@"
                                       SELECT * FROM `bill_paymongo`
                                       WHERE
                                       COALESCE(consult_req_pk,'') LIKE CONCAT('%',@consult_req_pk,'%')
                                       AND COALESCE(id,'') LIKE CONCAT('%',@id,'%')
                                       AND COALESCE(event_type,'') LIKE CONCAT('%',@event_type,'%')
                                       AND COALESCE(id,'') LIKE CONCAT('%',@id,'%')
                                       AND COALESCE(pay_src_type,'') LIKE CONCAT('%',@pay_src_type,'%')
                                       AND COALESCE(pay_descrip,'') LIKE CONCAT('%',@pay_descrip,'%')
                                       {UseFilter.GenWhereDateClause("logged_at", ">=", payload.filters.date_from)} 
                                       {UseFilter.GenWhereDateClause("logged_at", "<=", payload.filters.date_to)} 
                                       {UseFilter.GenTablePagination(payload.sort, payload.page)}
                            ", payload.filters, transaction: tran).ToList();

                bool has_more = table_data.Count > payload.page.limit;

                if (has_more)
                {
                    table_data.RemoveAt(table_data.Count - 1);
                }

                int count = has_more ? -1 : payload.page.begin * payload.page.limit + table_data.Count;

                return new ResponseModel
                {
                    success = true,
                    data =
                    new
                    {
                        table = table_data,
                        begin = payload.page.begin,
                        count = count,
                        limit = payload.page.limit
                    }
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
