import { Checkbox, FormControlLabel } from "@material-ui/core";
import { useField } from "formik";
import React, { FC, memo, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import FormDialog from "../../Component/FormDialog/FormDialog";
import { APP_NAME } from "../../Helpers/AppConfig";
import { RootStore } from "../../Services/Store";
interface IPrivacyPolicy {}

const PrivacyPolicyDialog: FC<IPrivacyPolicy> = memo(() => {
  const [openTos, setOpenTos] = useState(false);
  const [field, meta, helpers] = useField({ name: "tos" });
  const hospital_name = useSelector(
    (store: RootStore) => store.DefaultValuesReducer.hospital_name
  );

  const handleOpenTos = useCallback(() => {
    setOpenTos(true);
  }, []);
  const handleCloseTos = useCallback(() => {
    setOpenTos(false);
  }, []);

  return (
    <>
      <div className="forgetpass" onClick={() => handleOpenTos()}>
        <div className="forget-text">Terms of Service & Privacy Policy</div>
      </div>

      <FormDialog
        open={openTos}
        handleClose={handleCloseTos}
        title={` Terms of Service & Privacy Policy of ${hospital_name}-${APP_NAME}`}
        scroll={"paper"}
        body={
          <div>
            <StyledTos>
              <h3>PRIVACY NOTICE</h3>
              <p>
                The appropriate collection, use and disclosure of patients’
                personal health information is fundamental to our day-to-day
                operations and to patient care.
              </p>
              <p>
                Notre Dame de Chartres Hospital recognizes the importance of
                protecting personal and confidential information in all that we
                do and takes care to meet its legal and regulatory duties. This
                notice is one way in which Notre Dame de Chartres hospital
                complies with the Data Privacy Act of 2012. A way to demonstrate
                our commitment to our values of respecting diversity, acting
                with integrity, demonstrating compassion and striving for
                excellence.
              </p>
              <p>
                We strive to provide our patients with excellent medical care
                and service. Every member of the NDCH family must abide by our
                commitment to privacy in the handling of personal information.
              </p>
              <p>
                Our Privacy Policy attests to our commitment to privacy and
                demonstrates the ways to ensure that patient privacy is
                protected. Our Privacy Policy applies to the personal health
                information of all our patients that is in our possession and
                control.
              </p>
              <h3>PRIVACY NOTICE</h3>
              <p>
                We may ask for or hold personal information and health
                information about you which will be used to support delivery of
                appropriate care and treatment. This is to support the provision
                of high quality care.
              </p>
              <p>
                These personal information and health information may include
                the following:
              </p>
              <ul>
                <li>
                  Basic personal information, such as but not limited to your
                  name, address, date of birth, sex, religious affiliation,
                  contact information, occupation, marital status, citizenship
                </li>
                <li>
                  Relevant contact information of your relatives, guardian, or
                  next of kin.
                </li>
                <li>Chief complaints</li>
                <li>
                  Medical history, such as date of previous admission, existing
                  illness, medication intake
                </li>
                <li>
                  Vital signs (blood pressure, temperature, pulse rate,
                  respiratory rate)
                </li>
                <li>
                  Results of x-rays, scans, laboratory tests and other
                  diagnostic procedures
                </li>
                <li>Other information as necessary</li>
              </ul>

              <h3>How and when do we collect your data?</h3>
              <p>
                It is important that we collect accurate and timely information
                about you in both electronic and paper-based forms, before
                implementing the healthcare services that you are availing. If
                you feel that some of the information we collect are not
                necessary, please feel free to ask any of our healthcare staff
                so that they can explain to you why the information are needed
                and requested from you.
              </p>
              <h3>Why do we collect personal data about you?</h3>
              <ul>
                <li>To help inform decisions that we make about your care</li>
                <li>To ensure that your treatment is safe and effective</li>
                <li>
                  To work effectively with other organizations who may be
                  involved in your care
                </li>
                <li>To support the health of the general public</li>
                <li>To ensure our services can meet future needs</li>
                <li>
                  To review care provided to ensure it is of the highest
                  standard possible
                </li>
                <li>To train healthcare professionals</li>
                <li>For research and audit</li>
                <li>To prepare statistics</li>
              </ul>
              <p>
                There is a huge potential to use your information to deliver
                care and improve health and care services. The information can
                be used to help:
              </p>

              <ul>
                <li>Improve individual care</li>
                <li>Understand more about disease risks and causes</li>
                <li>Improve diagnosis</li>
                <li>Develop new treatments and prevent disease</li>
                <li>Plan services</li>
                <li>Improve patient safety</li>
              </ul>

              <p>It helps you because:</p>
              <ul>
                <li>
                  Accurate and up-to-date information assists us in providing
                  you with the best possible care.
                </li>
                <li>
                  If you see another healthcare professional, specialist of the
                  Institution, they can readily access the information they need
                  to provide you with the best possible care.
                </li>
              </ul>

              <p>
                We will be obtaining an informed consent from you or your
                authorized representative prior to the use of your personal data
                for purposes other than those stated above, such as trainings,
                researches and direct marketing.
              </p>

              <h3>How information is disclosed, retained and kept safe?</h3>

              <p>
                There are instances that we share your personal data to
                government agencies which lawfully collects information. We may
                also share personal information to fulfill legal mandate(s) like
                when ordered lawfully to do so by a court or a government agency
                or public authority. We may also share personal information with
                our service providers, partners, affiliates, and related
                entities who provide products and services to the Hospital for
                the same purpose as stated above.
              </p>
              <p>
                Information is retained in secure electronic and paper records
                and access is restricted to only those who need to know. We have
                set up adequate technical, physical, and organizational security
                measures to protect your data from unauthorized access and
                disclosure.
              </p>
              <p>
                We store your personal data in accordance with period guidelines
                and limitations provided by the Department of Health for
                retention of medical records.
              </p>

              <h3>What are your rights as the data subject?</h3>
              <p>
                Under the Data Privacy Act of 2012, you have the right to the
                following:
              </p>
              <ul>
                <li>
                  To be informed of the collection and processing of your
                  personal data
                </li>
                <li>To object to the processing of your personal data</li>
                <li>To access your personal data</li>
                <li>To correct inaccuracies or errors of your entries</li>
                <li>
                  To suspend, withdraw or order the blocking, removal or
                  destruction of your personal data from our filing system
                </li>
                <li>
                  To complain due to such inaccuracies, incomplete, outdated,
                  false, unlawfully obtained or unauthorized use of personal
                  data
                </li>
                <li>
                  Transmissibility of your rights to your lawful heirs and
                  assigns
                </li>
                <li>
                  To obtain a copy of such data in an electronic or structured
                  format where your personal data is processed by electronic
                  means and in a structured and commonly used format.{" "}
                </li>
              </ul>

              <h3>Website Privacy Policy</h3>
              <p>
                The sections below are applicable to the Website of Notre Dame
                de Chartres Hospital. Please be advised that practices described
                in this Privacy Policy apply only to information gathered online
                at our Website.
              </p>

              <p>By visiting our website, you are accepting these terms.</p>

              <h3>Website Log Data, “Cookies” and how we use them</h3>
              <p>
                By visiting our official website, we will monitor your
                activities through “Cookies”
              </p>

              <p>
                <b>Cookies</b> are packets of information that any website
                transfers to a user’s computer for record keeping purposes.
                These are used to keep track of user’s preferences for content
                and alert them to new content areas. Most browsers allow you to
                turn off cookies if you do not want them tracking your
                preferences. However, many sites will not function well if you
                disable them.
              </p>
              <p>
                These cookies do not contain your identifiable personal data. It
                is simply used as a tracking method of aggregate information for
                the number of website visitors, IP addresses, website referrals,
                most searched keywords and top visited webpages.
              </p>
              <p>
                By downloading images found in the website, you are voluntarily
                giving us your E-mail address. This data is stored in our
                database for security monitoring and not for marketing and
                non-medical purposes.
              </p>
              <p>
                Notre Dame de Chartres Hospital website use website cookies.
                These are only used to enhance the usability of our webpages. We
                do not store any personal information on our website or
                database.
              </p>

              <h3>Website Data Security</h3>

              <p>
                Notre Dame de Chartres Hospital official website is a highly
                secured website. NDCH ensures that all users visiting the site
                will have their confidential data protected from phishers and
                unauthorized personnel.
              </p>
              <h3>Changes to this Privacy Policy</h3>
              <p>
                This privacy policy applies to our website in general. Please
                note that NDCH reserves the right to change, amend and/or vary
                this Policy at any time. Any modification is effective
                immediately upon posting on this website. As you go thru the
                website, please check the privacy policy in case of changes and
                variations for specific portions of the site and do not assume
                that this privacy policy applies to all.
              </p>
              <h3>Complaints, concerns, or questions</h3>
              <p>
                For any complaints, concerns, or questions regarding the
                collection and use of your personal information, you can contact
                our Data Protection Officer at{" "}
                <span className="link">ndch.dpo@gmail.com</span>.
              </p>
              <p>
                You may also contact or visit us at: <br />
                Management Information System Unit
                <br />
                OLC Building
                <br />
                Notre Dame de Chartres Hospital
                <br />
                General Luna Road, Baguio City
                <br />
                Landline : (074) 424-3361 to 63 local 122
                <br />
              </p>
            </StyledTos>
          </div>
        }
        actions={
          <FormControlLabel
            control={
              <Checkbox
                checked={field.value}
                onChange={() => helpers.setValue(!field.value)}
                color="primary"
              />
            }
            label="Please indicate that you have read and agreed to the Terms of Service & Privacy Policy."
          />
        }
      />
    </>
  );
});

export default PrivacyPolicyDialog;

const StyledTos = styled.div`
  display: grid;
  grid-gap: 0.7em;
  font-size: 0.93em;

  ul {
    margin: 0 3em;
  }
`;
