import request from './index';

/**
 * huo quUserCartList
 */
export function getCart() {
  return request({
    url: '/cart',
    method: 'get'
  });
}

/**
 * tian jiaProductdaoCart
 * @param {Object} data - { productId, quantity }
 */
export function addToCart(data) {
  return request({
    url: '/cart',
    method: 'post',
    data
  });
}

/**
 * UpdateCartProductshu liang
 * @param {Number} cartId - CartxiangID
 * @param {Object} data - { quantity }
 */
export function updateCartQuantity(cartId, data) {
  return request({
    url: `/cart/${cartId}`,
    method: 'put',
    data
  });
}

/**
 * UpdateCartProductxuan zhongStatus
 * @param {Number} cartId - CartxiangID
 * @param {Object} data - { isSelected }
 */
export function updateCartSelection(cartId, data) {
  return request({
    url: `/cart/${cartId}/selection`,
    method: 'put',
    data
  });
}

/**
 * BatchUpdateCartProductxuan zhongStatus
 * @param {Object} data - { cartIds, isSelected }
 */
export function batchUpdateCartSelection(data) {
  return request({
    url: '/cart/batch-update-selection',
    method: 'put',
    data
  });
}

/**
 * DeleteCartProduct
 * @param {Number} cartId - CartxiangID
 */
export function removeFromCart(cartId) {
  return request({
    url: `/cart/${cartId}`,
    method: 'delete'
  });
}

/**
 * BatchDeleteCartProduct
 * @param {Object} data - { cartIds }
 */
export function batchRemoveFromCart(data) {
  return request({
    url: '/cart/batch-remove',
    method: 'delete',
    data
  });
}

/**
 * qing kongCart
 */
export function clearCart() {
  return request({
    url: '/cart/clear',
    method: 'delete'
  });
}

/**
 * huo quCartStatisticsInfo
 */
export function getCartSummary() {
  return request({
    url: '/cart/summary',
    method: 'get'
  });
}

/**
 * huo qu xuan zhong deCartProduct（yong yu xia dan）
 */
export function getSelectedItems() {
  return request({
    url: '/cart/selected',
    method: 'get'
  });
}