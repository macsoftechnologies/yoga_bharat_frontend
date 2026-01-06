// src/services/apiCalls.js
import api from "./api";

// ---------------- Admin APIs ----------------
export const loginAdmin = async (loginData) => {
  const response = await api.post("/admin/loginadmin", loginData);
  return response.data;
};

export const verifyAdmin = async (payload) => {
  const response = await api.post("/admin/verifyadmin", payload);
  return response.data;
};

export const adminForgotPassword = async (Forgotload) => {
  const response = await api.post("/admin/adminforgotpassword", Forgotload);
  return response.data;
};

// ---------------- Health Preference APIs ----------------
export const addHealthPreference = async (formData) => {
  const response = await api.post("/users/addhealthpreference", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getHealthPreferences = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(`/users/healthpreferences?page=${page}&limit=${limit}`, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  } catch (err) {
    console.error("API Error:", err);
    return []; 
  }
};

export const updateHealthPreference = async (formData) => {
  const response = await api.post("/users/updatehealthpreference",formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const HealthPreferenceById = async (prefId) => {
  const response = await api.post("/users/healthpreferencebyid",{ prefId },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

export const deleteHealthPreference = async (prefId) => {
  const response = await api.post("/users/deletehealthpreference",{ prefId },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// ---------------- Languages Preference APIs ----------------

export const addLanguage = async (data) => {
  const res = await api.post("/language/add", data, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

export const getLanguages = async (page = 1, limit = 10) => {
  const res = await api.get(`/language/list?page=${page}&limit=${limit}`);
  return res.data; 
};

export const getLanguageById = async (languageId) => {
  const response = await api.post(
    "/language/languagebyid",
    { languageId },
    { headers: { "Content-Type": "application/json" } }
  );
  return response.data;
};

export const updateLanguage = async (data) => {
  const response = await api.post(
    "/language/update",
    data, 
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const deleteLanguage = async (languageId) => {
  const response = await api.post(
    "/language/delete",
    { languageId },
    { headers: { "Content-Type": "application/json" } }
  );
  return response.data;
};

// ---------------- FeatureBanners APIs ----------------

export const addFeature = async (formData) => {
  const res = await api.post("/feature/add", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const getFeatures = async (page = 1, limit = 10) => {
  const res = await api.get(`/feature/list?page=${page}&limit=${limit}`);
  return res.data;
};

export const getFeatureById = async (featureId) => {
  const res = await api.post("/feature/bannerbyid", { featureId }, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

export const updateFeature = async (formData) => {
  const res = await api.post("/feature/update", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteFeature = async (featureId) => {
  const res = await api.post("/feature/delete", { featureId }, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// ---------------- Privacy Preference APIs ----------------

export const addPrivacy = async (data) => {
  const res = await api.post("/privacy/add", data, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

export const getPrivacyList = async (page = 1, limit = 10) => {
  const res = await api.get(`/privacy/list?page=${page}&limit=${limit}`);
  return res.data;
};

export const getPrivacyById = async (privacyId) => {
  const res = await api.post(
    "/privacy/privacybyid",
    { privacyId },
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
};

export const updatePrivacy = async (data) => {
  const res = await api.post("/privacy/update", data, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

export const deletePrivacy = async (privacyId) => {
  const res = await api.post(
    "/privacy/delete",
    { privacyId },
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
};

// ---------------- Terms & Conditions APIs ----------------

export const addTerms = async (data) => {
  const res = await api.post(
    "/terms/add",
    data,
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
};

export const getTerms = async (page = 1, limit = 10) => {
  const res = await api.get(`/terms/list?page=${page}&limit=${limit}`);
  return res.data;
};

export const getTermsById = async (termsId) => {
  const res = await api.post(
    "/terms/termsbyid",
    { termsId },
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
};

export const updateTerms = async (data) => {
  const res = await api.post(
    "/terms/update",
    data,
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
};

export const deleteTerms = async (termsId) => {
  const res = await api.post(
    "/terms/delete",
    { termsId },
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
};

// ---------------- SplashScreen APIs ----------------

export const addSplashScreen = async (data) => {
  const res = await api.post("/splashscreen/add", data, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

export const getSplashScreens = async (page = 1, limit = 10) => {
  const res = await api.get(`/splashscreen/list?page=${page}&limit=${limit}`);
  return res.data;
};

export const getSplashScreenById = async (splashscreenId) => {
  const res = await api.post("/splashscreen/screentextbyid", { splashscreenId });
  return res.data; 
};

export const updateSplashScreen = async (data) => {
  const res = await api.post("/splashscreen/update", data, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

export const deleteSplashScreen = async (splashscreenId) => {
  const res = await api.post("/splashscreen/delete", { splashscreenId }, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// ---------------- AppTutorial APIs ----------------

export const addAppTutorial = async (formData) => {
  const res = await api.post("/apptutorial/add", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const getAppTutorials = async (page = 1, limit = 10) => {
  const res = await api.get(`/apptutorial/list?page=${page}&limit=${limit}`);
  return res.data;
};

export const getAppTutorialById = async (appId) => {
  const res = await api.post("/apptutorial/tutorialbyid", { appId }, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

export const updateAppTutorial = async (formData) => {
  const res = await api.post("/apptutorial/update", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteAppTutorial = async (appId) => {
  const res = await api.post("/apptutorial/delete", { appId }, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// ---------------- Yogs APIs ----------------

export const addYoga = async (formData) => {
  try {
    const res = await api.post("/yoga/add", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error("Add Yoga API Error:", err);
    throw err;
  }
};
export const getYogaList = async (page = 1, limit = 10) => {
  try {
    const res = await api.get(`/yoga/list?page=${page}&limit=${limit}`, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data || [];
  } catch (err) {
    console.error("Get Yoga List API Error:", err);
    return [];
  }
};

export const updateYoga = async (formData) => {
  try {
    const res = await api.post("/yoga/update", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error("Update Yoga API Error:", err);
    throw err;
  }
};

export const yogaById = async (yogaId) => {
  const res = await api.post("/yoga/yogabyid", { yogaId }, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

export const deleteYoga = async (yogaId) => {
  const res = await api.post("/yoga/delete", { yogaId }, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// ---------------- Users APIs  Clients----------------

export const getClients = async (page = 1, limit = 10) => {
  try {
    const res = await api.get(`/users/clients?page=${page}&limit=${limit}`, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data.data || [];
  } catch (err) {
    console.error("Get Clients API Error:", err);
    return [];
  }
};

export const getTrainers = async (page = 1, limit = 10) => {
  try {
    const res = await api.get(`/users/trainers?page=${page}&limit=${limit}`, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data.data || [];
  } catch (err) {
    console.error("Get Trainers API Error:", err);
    return [];
  }
};

export const approveTrainer = async (userId) => {
  try {
    const res = await api.post(
      "/users/approvetrainer",
      { userId },
      { headers: { "Content-Type": "application/json" } }
    );
    return res.data;
  } catch (err) {
    console.error("Approve Trainer API Error:", err);
    throw err;
  }
};

export const getCertificatesByUser = async (userId) => {
  const res = await api.post(
    "/users/certificatebyuser",
    { userId },
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return res.data;
};



// ---------------- Users APIs Booking----------------

export const getBookings = async (page = 1, limit = 10) => {
  try {
    const res = await api.post(
      `/booking/filterlist?page=${page}&limit=${limit}`,
      {},
      { headers: { "Content-Type": "application/json" } }
    );
    return res.data;
  } catch (err) {
    console.error("Get Bookings API Error:", err);
    return null;
  }
};

