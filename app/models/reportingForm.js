const mongoose = require('mongoose');
const { Schema } = mongoose;

const reportingFormSchema = new mongoose.Schema(
  {
    // Mahanagar Fields
    mahanagar: {
      zila_sam_mahanagar_bhag_sankhya: { type: Number },
      sewa_basti_sankhya: { type: Number },
      sewa_kary_yukt_sewa_basti: { type: Number },
      vyavsayee_w_mahawidyalay_shakha_w_milan_sankhya: { type: Number },
      sewa_basti_palak_shakha_w_milan_sankhya: { type: Number },
      sewa_karyakarta_yukt_shakha_w_milan_sankhya: { type: Number },
      kul_sewa_karyakarta: { type: Number },
      mahanagar_mein_kul_sewa_kary: { type: Number },
      masik_sewa_basti_sampark_karne_wali_shakha_w_milan_sankhya: { type: Number },
    },

    // JilaKendra Fields
    jilaKendra: {
      zila_sam_jila_kendra_bhag_sankhya: { type: Number },
      inmein_sewa_basti_sankhya: { type: Number },
      sewa_kary_yukt_sewa_basti: { type: Number },
      vyavsayee_w_mahawidyalay_shakha_w_milan_sankhya: { type: Number },
      sewa_basti_palak_shakha_w_milan_sankhya: { type: Number },
      sewa_karyakarta_yukt_shakha_w_milan_sankhya: { type: Number },
      kul_sewa_karyakarta: { type: Number },
      jila_kendra_mein_kul_sewa_kary: { type: Number },
      masik_sewa_basti_sampark_karne_wali_shakha_w_milan_sankhya: { type: Number },
    },

    // AnyaNagar Fields
    anyaNagar: {
      zila_sam_anya_nagar_bhag_sankhya: { type: Number },
      inmein_sewa_basti_sankhya: { type: Number },
      sewa_kary_yukt_sewa_basti: { type: Number },
      vyavsayee_w_mahawidyalay_shakha_w_milan_sankhya: { type: Number },
      sewa_basti_palak_shakha_w_milan_sankhya: { type: Number },
      sewa_karyakarta_yukt_shakha_w_milan_sankhya: { type: Number },
      kul_sewa_karyakarta: { type: Number },
      anya_nagar_mein_kul_sewa_kary: { type: Number },
      masik_sewa_basti_sampark_karne_wali_shakha_w_milan_sankhya: { type: Number },
    },

    // Villages Over 5000 Fields
    villagesOver5000: {
      total_villages: { type: Number },
      business_and_farming_villages: { type: Number },
      service_work_villages: { type: Number },
      total_service_work: { type: Number },
    },

    // Villages Under 5000 Fields
    villagesUnder5000: {
      service_work_villages: { type: Number },
      total_service_work: { type: Number },
    },

    user_type_id: { type: Schema.Types.ObjectId, ref: 'Users', },

  },
  {
    timestamps: true,
  }
);

exports.ReportingForm = mongoose.model('ReportingForm', reportingFormSchema);
