// Activity Database
// This file contains the definitions for all the different activity types,
// their required documentation, and fields.

const ActivityData = {
    'worksource_online': [
        { id: 'ws_online_setup_account', text: 'Set up a WorkSource job seeker account', doc: 'A screenshot of or link to your profile.', proof: 'required', fields: [{ id: 'link', ph: 'Link to profile' }] },
        { id: 'ws_online_upload_resume', text: 'Upload resume to WorkSource & make searchable', doc: 'A screenshot of or link to your resume.', proof: 'required', fields: [{ id: 'link', ph: 'Link to resume' }] },
        { id: 'ws_online_virtual_workshop', text: 'Join a virtual WorkSource workshop', doc: 'Name of the workshop, Name of the facilitator, A screenshot of proof of completion.', proof: 'required', fields: [{ id: 'workshop_name', ph: 'Workshop Name' }, { id: 'facilitator_name', ph: 'Facilitator Name' }] },
        { id: 'ws_online_career_profile', text: 'Complete the WorkSource career profile tool', doc: 'A screenshot of proof of completion.', proof: 'required' },
        { id: 'ws_online_resea', text: 'Participate in RESEA initial or follow-up', doc: 'Name of activity, date, and where or how completed.', proof: 'none', fields: [{ id: 'meeting_type', ph: 'Meeting Type' }] }
    ],
    'worksource_inperson': [
        { id: 'ws_inperson_workshop', text: 'Join an in-person WorkSource workshop', doc: 'Name, date and location of the workshop.', proof: 'none', fields: [{ id: 'workshop_name', ph: 'Workshop Name' }, { id: 'office_name', ph: 'Office Name' }, { id: 'office_city', ph: 'Office City' }, { id: 'office_state', ph: 'Office State' }] },
        { id: 'ws_inperson_specialist', text: 'Meet with a WorkSource specialist/coach', doc: 'Name of the specialist or coach. Date and time you met.', proof: 'none', fields: [{ id: 'specialist_name', ph: 'Specialist/Coach Name' }, { id: 'office_name', ph: 'Office Name' }, { id: 'office_city', ph: 'Office City' }, { id: 'office_state', ph: 'Office State' }] },
        { id: 'ws_inperson_job_fair', text: 'Participate in WorkSource job fair/club/event', doc: 'Date and location of the job fair. Name and contact information of the employer you spoke to.', proof: 'none', fields: [{ id: 'event_name', ph: 'Event Name' }, { id: 'office_name', ph: 'Office Name' }, { id: 'office_city', ph: 'Office City' }, { id: 'office_state', ph: 'Office State' }, { id: 'employer_contact', ph: 'Employer Contacted' }] },
        { id: 'ws_inperson_resea', text: 'Participate in RESEA initial or follow-up', doc: 'Name of activity, date, and where or how completed.', proof: 'none', fields: [{ id: 'meeting_type', ph: 'Meeting Type' }, { id: 'office_name', ph: 'Office Name' }, { id: 'office_city', ph: 'Office City' }, { id: 'office_state', ph: 'Office State' }] }
    ],
    'hiring_events_etc': [
        { id: 'he_job_fair', text: 'Attend in-person/virtual job fair or hiring event', doc: 'Your registration letter or email. Include employer name, contact info, and how you made contact.', proof: 'required', fields: [{ id: 'event_name', ph: 'Event Name' }, { id: 'employer_contact', ph: 'Employer Contacted' }, { id: 'contact_info', ph: 'Employer Contact Info' }, { id: 'contact_type', ph: 'Employer Contact Type' }] },
        { id: 'he_30_second_speech', text: 'Prepare and practice a 30-second speech', doc: 'A copy of your speech. (Uploading a doc/screenshot is optional).', proof: 'optional', fields: [{ id: 'speech_text', ph: 'Paste your speech here (optional)', type: 'textarea' }] },
        { id: 'he_job_club', text: 'Participate in a private or community job club', doc: 'A letter or email from the club leader or sponsor.', proof: 'required', fields: [{ id: 'club_name', ph: 'Job Club Name' }, { id: 'leader_name', ph: 'Leader/Sponsor Name' }] },
        { id: 'he_internship', text: 'Participate in private-sector work experience/internship', doc: 'A letter from the employer.', proof: 'required', fields: [{ id: 'employer_name', ph: 'Employer Name' }] },
        { id: 'he_job_shadowing', text: 'Complete a virtual or remote job shadowing', doc: 'Copy of a letter or email from the person you shadowed.', proof: 'required', fields: [{ id: 'person_shadowed', ph: 'Person Shadowed' }, { id: 'company', ph: 'Company' }] },
        { id: 'he_ojt', text: 'Participate in private on-the-job-training (OJT)', doc: 'Name of company, Position, Type of activity, Where or how shadowing was completed.', proof: 'none', fields: [{ id: 'company', ph: 'Company' }, { id: 'position', ph: 'Position' }] }
    ],
    'job_search_websites': [
        { id: 'jsw_update_account', text: 'Set up/update account on job search website (Indeed, LinkedIn, etc.)', doc: 'A screenshot of or link to your account page.', proof: 'optional', fields: [{ id: 'link', ph: 'Link to account page' }, { id: 'update_details', ph: 'Update Details' }] },
        { id: 'jsw_post_resume', text: 'Set up/update account, post resume/cover letter (Monster, etc.)', doc: 'A screenshot of or link to your account page.', proof: 'required', fields: [{ id: 'link', ph: 'Link to account page' }] },
        { id: 'jsw_interest_inventory', text: 'Complete online interest inventory (Strong, My Next Move, etc.)', doc: 'A screenshot of your results.', proof: 'required', fields: [{ id: 'inventory_name', ph: 'Name of Inventory' }] },
        { id: 'jsw_workkeys', text: 'Complete an ACT WorkKeys assessment', doc: 'A screenshot of your results.', proof: 'required' }
    ],
    'education_credentials': [
        { id: 'ec_watch_video', text: 'Watch an online video on a job search topic', doc: 'A screenshot of the video launch page.', proof: 'required', fields: [{ id: 'link', ph: 'Link to video' }] },
        { id: 'ec_work_readiness', text: 'Get a National Work Readiness Credential', doc: 'A screenshot of proof of completion.', proof: 'required' },
        { id: 'ec_linkedin_learning', text: 'Complete LinkedIn Learning or similar certified course', doc: 'A receipt for the course or a screenshot of proof of completion.', proof: 'required', fields: [{ id: 'course_name', ph: 'Course Name' }] },
        { id: 'ec_labor_market_research', text: 'Conduct labor market research on esd.wa.gov', doc: 'Take a screenshot of the information.', proof: 'required' }
    ],
    'instructor_led_courses': [
        { id: 'ilc_esl', text: 'Instructor-led ESL course or class', doc: 'Name, date and location of the class. A receipt or screenshot of proof of completion.', proof: 'required', fields: [{ id: 'class_name', ph: 'Class Name' }, { id: 'location', ph: 'Location' }] },
        { id: 'ilc_abe', text: 'Instructor-led Adult Basic Education (ABE) course or class', doc: 'Name, date and location of the class. A receipt or screenshot of proof of completion.', proof: 'required', fields: [{ id: 'class_name', ph: 'Class Name' }, { id: 'location', ph: 'Location' }] },
        { id: 'ilc_ged', text: 'Instructor-led General Educational Development (GED) course or class', doc: 'Name, date and location of the class. A receipt or screenshot of proof of completion.', proof: 'required', fields: [{ id: 'class_name', ph: 'Class Name' }, { id: 'location', ph: 'Location' }] },
        { id: 'ilc_skills', text: 'Instructor-led occupational skills or computer course', doc: 'A receipt for the course or a screenshot of proof of completion.', proof: 'required', fields: [{ id: 'course_name', ph: 'Course Name' }] },
        { id: 'ilc_computer_lit', text: 'Instructor-led computer literacy course or class', doc: 'A receipt for the course or a screenshot of proof of completion.', proof: 'required', fields: [{ id: 'class_name', ph: 'Class Name' }] }
    ],
    'self_paced_courses': [
        { id: 'spc_esl', text: 'Self-paced ESL course or class', doc: 'A receipt for the course or a screenshot of proof of completion.', proof: 'required', fields: [{ id: 'course_name', ph: 'Course Name' }] },
        { id: 'spc_abe', text: 'Self-paced Adult Basic Education (ABE) course or class', doc: 'A receipt for the course or a screenshot of proof of completion.', proof: 'required', fields: [{ id: 'course_name', ph: 'Course Name' }] },
        { id: 'spc_ged', text: 'Self-paced General Educational Development (GED) course or class', doc: 'A receipt for the course or a screenshot of proof of completion.', proof: 'required', fields: [{ id: 'course_name', ph: 'Course Name' }] },
        { id: 'spc_skills', text: 'Self-paced occupational skills or computer course', doc: 'A receipt for the course or a screenshot of proof of completion.', proof: 'required', fields: [{ id: 'course_name', ph: 'Course Name' }] },
        { id: 'spc_computer_lit', text: 'Self-paced computer literacy course or class', doc: 'A receipt for the course or a screenshot of proof of completion.', proof: 'required', fields: [{ id: 'course_name', ph: 'Course Name' }] }
    ],
    'app_based_work': [
        { id: 'abw_setup_account', text: 'Set up/activate account (Uber, Lyft, Doordash, etc.)', doc: 'A screenshot of: required license renewal, completed on-boarding, completed vehicle inspection, or contact with support.', proof: 'required', fields: [{ id: 'platform_name', ph: 'Platform (Uber, Lyft, etc.)' }] },
        { id: 'abw_active_efforts', text: 'Other activities showing ongoing/active efforts (logging in, available for work)', doc: 'Screenshots demonstrating ongoing and active efforts to log-in and be available for work.', proof: 'required', fields: [{ id: 'platform_name', ph: 'Platform (Uber, Lyft, etc.)' }] }
    ],
    'private_career_coach': [
        { id: 'pcc_signup', text: 'Sign up with a private career coach or service', doc: 'A screenshot of your agreement.', proof: 'required', fields: [{ id: 'coach_name', ph: 'Coach or Service Name' }] },
        { id: 'pcc_register_agency', text: 'Register with placement agency/recruiter/headhunter', doc: 'A screenshot of your agreement or registration.', proof: 'required', fields: [{ id: 'agency_name', ph: 'Agency Name' }] },
        { id: 'pcc_webinar', text: 'Complete job search webinar/course by placement agency', doc: 'A screenshot of your course completion.', proof: 'required', fields: [{ id: 'course_name', ph: 'Course Name' }, { id: 'agency_name', ph: 'Agency Name' }] }
    ],
    'wioa_programs': [
        { id: 'wioa_enroll_plan', text: 'Enroll in WIOA Title I-B & develop Individual Employment Plan', doc: 'The activity name, the date and where or how you completed it.', proof: 'none' },
        { id: 'wioa_enroll_service', text: 'Enroll in WIOA Title I-B & receive basic/individualized career service', doc: 'The activity name, the date and where or how you completed it.', proof: 'none' },
        { id: 'wioa_incumbent_training', text: 'Enroll in WIOA Title I-B incumbent worker training', doc: 'The activity name, the date and where or how you completed it.', proof: 'none' },
        { id: 'wioa_work_experience', text: 'Enroll in WIOA Title I-B paid/unpaid work experience or internship', doc: 'The activity name, the date and where or how you completed it.', proof: 'none' },
        { id: 'wioa_ojt', text: 'Enroll in WIOA Title I-B on-the-job training', doc: 'The activity name, the date and where or how you completed it.', proof: 'none' }
    ],
    'vocational_rehab': [
        { id: 'vr_dsb_readiness', text: 'Dept. of Services for the Blind (DSB): Vocational readiness', doc: 'A copy of your email or letter from the counselor.', proof: 'required' },
        { id: 'vr_dsb_search', text: 'Dept. of Services for the Blind (DSB): Job search', doc: 'A copy of your email or letter from the counselor.', proof: 'required' },
        { id: 'vr_dsb_adjustment', text: 'Dept. of Services for the Blind (DSB): Adjustment to disability', doc: 'A copy of your email or letter from the counselor.', proof: 'required' },
        { id: 'vr_dsb_adaptive', text: 'Dept. of Services for the Blind (DSB): Adaptive skills activity', doc: 'A copy of your email or letter from the counselor.', proof: 'required' },
        { id: 'vr_dvr_readiness', text: 'Division of Vocational Rehabilitation (DVR): Vocational readiness', doc: 'A copy of your email or letter from the counselor.', proof: 'required' },
        { id: 'vr_dvr_search', text: 'Division of Vocational Rehabilitation (DVR): Job search activity', doc: 'A copy of your email or letter from the counselor.', proof: 'required' }
    ]
};
