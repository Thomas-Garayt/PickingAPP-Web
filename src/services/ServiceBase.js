// @flow

// $FlowIgnoreMe
import request from 'reqwest';
import when from 'when';
import TokenContainer from 'services/TokenContainer';

/**
 * Abstract class that contains basic methods for Services (GET / POST / PATCH / DELETE).
 */
export default class ServiceBase {
    RESOURCE_URL: string;

    /**
     * Constructor of the class ServiceBase.
     * @param {string} resourceUrl The URL to access the resource on the API.
     */
    constructor(resourceUrl: string) {
        if (!resourceUrl || resourceUrl === '') {
            throw new Error('Resource URL is required.');
        }
        this.RESOURCE_URL = resourceUrl;
    }

    /**
     * Get all resources.
     *
     * @returns {Promise} A promise to handle the request ascynchronously.
     */
    getAll(): Promise<*> {
        return this.execute({
            url: this.RESOURCE_URL,
            method: 'GET',
        });
    }

    /**
     * Get a resource by unique identifier.
     *
     * @param {number} id The identifier of the resource.
     * @returns {Promise} A promise to handle the request ascynchronously.
     */
    getById(id: number): Promise<*> {
        return this.execute({
            url: `${this.RESOURCE_URL}/${id}`,
            method: 'GET',
        });
    }

    /**
     * Post a new resource.
     *
     * @param {Object} resource The resource to create.
     * @returns {Promise} A promise to handle the request ascynchronously.
     */
    post(resource: Object): Promise<*> {
        return this.execute({
            url: this.RESOURCE_URL,
            method: 'POST',
            data: resource,
        });
    }

    /**
     * Delete an existing resource.
     * @param {number} id The identifier of the resource.
     * @returns {Promise} A promise to handle the request ascynchronously.
     */
    remove(id: number): Promise<*> {
        return this.execute({
            url: `${this.RESOURCE_URL}/${id}`,
            method: 'DELETE',
        });
    }

    /**
     * Fully update an existing resource. All the properties of the resource should be set.
     * @param {number} id The identifier of the resource.
     * @param {Object} resource The new properties of the resource.
     * @returns {Promise} A promise to handle the request ascynchronously.
     */
    update(id: number, resource: Object): Promise<*> {
        return this.execute({
            url: `${this.RESOURCE_URL}/${id}`,
            method: 'PUT',
            data: resource,
        });
    }

    /**
     * Patch an existing resource. Only the properties that are set on the patch will be updated.
     * @param {number} id The identifier of the resource.
     * @param {Object} patch The properties to update.
     * @returns {Promise} A promise to handle the request ascynchronously.
     */
    patch(id: number, patch: Object): Promise<*> {
        return this.execute({
            url: `${this.RESOURCE_URL}/${id}`,
            method: 'PATCH',
            data: patch,
        });
    }

    /**
     * Execute a custom request to the API.
     * @param {{url: string, method: string, data: Object}} url => The url of the request | method => The method of the request. Default is GET. | data => The data of the request (optionnal)
     * @returns {Promise} A promise to handle the request ascynchronously.
     */
    execute(options: { url: string, method: string, data?: Object }): Promise<*> {
        if (!options.url) {
            throw new Error('The URL is required');
        }

        const method = options.method || 'GET';

        const query = {
            url: options.url,
            method,
            crossOrigin: true,
            type: 'json',
            contentType: 'application/json',
            headers: { 'X-Auth-Token': TokenContainer.get() },
            data: undefined,
        };
        if (options.data) {
            query.data = JSON.stringify(options.data);
        }

        return when(request(query));
    }
}
