import HttpClientBase from "./HttpClientBase.js";

export default class FaqService extends HttpClientBase {
    async list() {
        return this.get("/faqs/list");
    }
}