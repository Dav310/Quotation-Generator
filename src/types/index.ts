export interface QuotationModule {
  name: string;
  description: string;
  cost: number;
}

export interface DeliveryWeek {
  week: string;
  tasks: string;
}

export interface PaymentMilestone {
  percentage: number;
  amount: number;
  description: string;
}

export interface ServiceProviderSignatory {
  name: string;
  designation: string;
}

export interface QuotationData {
  title: string;
  description: string;
  modules: QuotationModule[];
  deliveryPlan: DeliveryWeek[];
  deliverables: string[];
  paymentMilestones: PaymentMilestone[];
  assumptions: string[];
  totalCost: number;
  serviceProviders: ServiceProviderSignatory[];
}

export interface QuotationMeta {
  companyName: string;
  clientDesignation: string;
  repName1: string;
  repName2: string;
  gstin: string;
  quotationNumber: string;
  date: string;
  validity: string;
  providers1: string;
  providers2: string;
  trade: string;
  type: string;
}
