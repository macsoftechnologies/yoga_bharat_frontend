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
    return response.data;
  } catch (err) {
    console.error("API Error:", err);
    return { data: [], totalPages: 1, totalCount: 0 };
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
  const res = await api.post(
    "/apptutorial/delete",
    { appId },
    {
      headers: { "Content-Type": "application/json" },
    }
  );
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



export const getYogaList = async (page = 1, limit = 10, params = {}) => {
  try {
    const queryParams = { ...params };
    if (page  != null) queryParams.page  = page;
    if (limit != null) queryParams.limit = limit;
 
    const res = await api.get("/yoga/list", { params: queryParams });
 
    return res.data;
  } catch (err) {
    console.error("Get Yoga List API Error:", err);
    return { data: [], totalPages: 1, totalCount: 0 };
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

export const getClients = async (page = 1, limit = 10, params = {}) => {
  try {
    // const params = new URLSearchParams();
    // params.append("page",  page);
    // params.append("limit", limit);
 
    // if (filters.name)         params.append("name",         filters.name);
    // if (filters.mobileNumber) params.append("mobileNumber", filters.mobileNumber);
    // if (filters.gender)       params.append("gender",       filters.gender);
    // if (filters.fromDate)     params.append("fromDate",     filters.fromDate);
    // if (filters.toDate)       params.append("toDate",       filters.toDate);
    // if (filters.sortOrder)    params.append("sortOrder",    filters.sortOrder); // "asc" or "des"
 
    const queryParams = { ...params };
  if (page  != null) queryParams.page  = page;   // ✅ skipped when null
  if (limit != null) queryParams.limit = limit;

    // const res = await api.get(`/users/clients?${params.toString()}`, {
    //   headers: { "Content-Type": "application/json" },
    // });

    const res = await api.get("/users/clients", { params: queryParams });

    return res.data;
  } catch (err) {
    console.error("Get Clients API Error:", err);
    return { data: [], totalPages: 1, totalCount: 0 };
  }
};

export const getTrainers = async (page = 1, limit = 10, params = {}) => {
  try {
    // const params = new URLSearchParams();
    const queryParams = { ...params };
    if (page  != null) queryParams.page = page;
    if (limit != null) queryParams.limit = limit;
 
    // if (filters.name)         params.append("name",         filters.name);
    // if (filters.mobileNumber) params.append("mobileNumber", filters.mobileNumber);
    // if (filters.gender)       params.append("gender",       filters.gender);
    // if (filters.fromDate)     params.append("fromDate",     filters.fromDate);
    // if (filters.toDate)       params.append("toDate",       filters.toDate);
    // if (filters.sortOrder)    params.append("sortOrder",    filters.sortOrder); // "asc" or "des"
 
    // const res = await api.get(`/users/trainers?${params.toString()}`, {
    //   headers: { "Content-Type": "application/json" },
    // });
    const res = await api.get("/users/trainers", { params: queryParams });
    return res.data;
  } catch (err) {
    console.error("Get Trainers API Error:", err);
    return { data: [], totalPages: 1, totalCount: 0 };
  }
};

export const disableTrainer = async (userId, isDisabled) => {
  const res = await api.post(
    "/users/disabletrainer",
    { userId, isDisabled: String(isDisabled) },
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
};



export const rejectTrainer = async (userId, rejectReason = "", rejectType = "Ekyc") => {
  try {
    const res = await api.post(
      "/users/approvetrainer",
      {
        userId,
        ekyc_status:   "rejected",
        reject_reason: rejectReason,
        reject_type:   rejectType,  
      },
      { headers: { "Content-Type": "application/json" } }
    );
    return res.data;
  } catch (err) {
    console.error("Reject Trainer API Error:", err);
    throw err;
  }
};

export const approveTrainer = async (userId) => {
  try {
    const res = await api.post(
      "/users/approvetrainer",
      { userId, ekyc_status: "approved" },
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

export const getBookings = async (page = 1, limit = 10, filters = {}) => {
  try {
    const res = await api.post(
      `/booking/filterlist?page=${page}&limit=${limit}`,
      filters,
      { headers: { "Content-Type": "application/json" } }
    );

    return res.data;
  } catch (err) {
    console.error("Get Bookings API Error:", err);
    return null;
  }
};

// ---------------- Users APIs Call Requests----------------
export const getCallBackRequests = async (page = 1, limit = 10) => {
  try {
    const res = await api.get(`/callback?page=${page}&limit=${limit}`, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data.data || [];
  } catch (err) {
    console.error("Get Trainers API Error:", err);
    return [];
  }
};

export const completeCallBackRequest = async (payload) => {
  try {
    const res = await api.post("/callback/completeRequest", payload, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (err) {
    console.error("Complete Callback Request API Error:", err);
    throw err;
  }
};

export const getTrainerEarning = async (trainerId) => {
  const res = await api.post(
    "/booking/gettrainerearning",
    { trainerId },
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return res.data;
};

export const getDashboardStats = async (fromDate, toDate) => {
  const res = await api.get("/booking/dashboard-stats", {
    params: { fromDate, toDate },
  });

  return res.data;
};

export const dashboardMonthlyEarnings = async (year) => {
  const res = await api.get("/booking/monthly-myearning-stats", {
    params: { year },
  });

  return res.data;
};

export const dashboardBookingStats = async (year) => {
  const res = await api.get("/booking/monthly-stats", {
    params: { year },
  });

  return res.data;
};

export const dashboardTypeDistribution = async () => {
  const res = await api.get("/booking/yoga-distribution", {
  });

  return res.data;
};


export const addBulksms = async (data) => {
  const res = await api.post("/notifications/addbulksms", data, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

export const getSmsList = async (page = 1, limit = 10) => {
  const res = await api.get(`/notifications/sms?page=${page}&limit=${limit}`);
  return res.data;
};


export const addCategory = async (data) => {
  const res = await api.post("/category/add", data, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};
 
export const getCategoryList = async (page = 1, limit = 10) => {
  const res = await api.get(`/category?page=${page}&limit=${limit}`);
  return res.data;
};
 
export const CategoryById = async (categoryId) => {
  const res = await api.get(`/category/${categoryId}`);
  return res.data;
};


export const getPaymentCycles = async (page = 1, limit = 10, params = {}) => {
  try {
    const queryParams = { ...params };
    // const params = new URLSearchParams();
    if (page  != null) queryParams.page = page;
    if (limit != null) queryParams.limit = limit;
 
    // if (filters.trainerId) params.append("trainerId", filters.trainerId);
    // if (filters.status)    params.append("status",    filters.status);
 
    // const res = await api.get(`/admin/payment-cycles?${params.toString()}`, {
    //   headers: { "Content-Type": "application/json" },
    // });
    const res = await api.get("/admin/payment-cycles", { params: queryParams });
    return res.data;
  } catch (err) {
    console.error("Get Payment Cycles API Error:", err);
    return { data: [], totalPages: 1, totalCount: 0 };
  }
};

export const getPaymentCycleById = async (cycleId) => {
  try { 
    const res = await api.get(`/admin/payment-cycles/${cycleId}/earnings`, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (err) {
    console.error("Get Payment Cycle By ID Error:", err);
    return { data: null, earnings: [] };
  }
};


// ── Approve Payment Cycle ─────────────────────────────────────────────────
export const approvePaymentCycle = async (cycleId, payload) => {
  try {
    const res = await api.post(`/admin/payment-cycles/${cycleId}/approve`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (err) {
    console.error("Approve Payment Cycle Error:", err);
    throw err;
  }
};
 
// ── Reject Payment Cycle ──────────────────────────────────────────────────
export const rejectPaymentCycle = async (cycleId, payload) => {
  try {
    const res = await api.post(`/admin/payment-cycles/${cycleId}/reject`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (err) {
    console.error("Reject Payment Cycle Error:", err);
    throw err;
  }
};
 
// ── Mark Payment Cycle as Paid ────────────────────────────────────────────
export const markPaymentCyclePaid = async (cycleId, payload) => {
  try {
    const res = await api.post(`/admin/payment-cycles/${cycleId}/mark-paid`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (err) {
    console.error("Mark Payment Cycle Paid Error:", err);
    throw err;
  }
};

export const reinitiatePaymentCycle = async (payload) => {
  try {
    const res = await api.post(`/admin/payment-cycles/manual-cycle`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (err) {
    console.error("Re-initiate Payment Cycle Error:", err);
    throw err;
  }
};

