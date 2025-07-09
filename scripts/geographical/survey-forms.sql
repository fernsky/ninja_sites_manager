-- Building Survey
INSERT INTO
    public.acme_odk_survey_forms (
        id,
        "name",
        url,
        odk_project_id,
        odk_form_id,
        username,
        "password",
        attachment_paths,
        update_interval,
        last_fetched
    )
VALUES
    (
        'Kerabari_building_survey',
        'Kerabari Building Survey',
        '"\"https://survey.digprofile.com\""',
        4,
        'Kerabari_Buildings',
        '"\"supervisor@likhupike.com\""',
        '"\"supervisor\""',
        '{"{\"path\":\"building_image\",\"type\":\"building_image\"}","{\"path\":\"monitoring_audio\",\"type\":\"audio_monitoring\"}","{\"path\":\"enumerator_selfie\",\"type\":\"building_selfie\"}"}',
        100000,
        '2025-01-21 11:35:10.984'
    );

INSERT INTO
    public.acme_odk_survey_forms (
        id,
        "name",
        url,
        odk_project_id,
        odk_form_id,
        username,
        "password",
        attachment_paths,
        update_interval,
        last_fetched
    )
VALUES
    (
        'Kerabari_business_survey',
        'Kerabari Business Survey',
        '"\"https://survey.digprofile.com\""',
        4,
        'biz',
        '"\"supervisor@likhupike.com\""',
        '"\"supervisor\""',
        '{"{\"path\":\"bimg\",\"type\":\"business_image\"}","{\"path\":\"bimg_selfie\",\"type\":\"business_selfie\"}","{\"path\":\"audio_monitoring\",\"type\":\"audio_monitoring\"}"}',
        720000,
        '2025-01-22 06:27:58.231'
    );

INSERT INTO
    public.acme_odk_survey_forms (
        id,
        name,
        url,
        odk_project_id,
        odk_form_id,
        username,
        "password",
        attachment_paths,
        update_interval,
        last_fetched
    )
VALUES
    (
        'Kerabari_family_survey',
        'Kerabari Family Survey',
        '"\"https://survey.digprofile.com\""',
        2,
        'household',
        '"\"supervisor@likhupike.com\""',
        '"\"supervisor\""',
        '{"{\"path\":\"audio_monitoring\",\"type\":\"audio_monitoring\"}","{\"path\":\"himg\",\"type\":\"family_head_image\"}","{\"path\":\"himg_selfie\",\"type\":\"family_head_selfie\"}"}',
        36000,
        '2025-01-23 02:42:24.505'
    );