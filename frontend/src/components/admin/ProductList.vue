<template>
  <div class="product-list">
    <!-- Searchhe guo lv qu yu -->
    <el-card class="filter-card">
      <el-form :inline="true" :model="filters" class="filter-form">
        <el-form-item label="Productming cheng">
          <el-input
            v-model="filters.keyword"
            placeholder="qing shu ruProductming cheng"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        
        <el-form-item label="ProductCategory">
          <el-select
            v-model="filters.categoryId"
            placeholder="qing xuan zeCategory"
            clearable
            style="width: 160px"
          >
            <el-option
              v-for="category in categories"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="ProductStatus">
          <el-select
            v-model="filters.status"
            placeholder="qing xuan zeStatus"
            clearable
            style="width: 120px"
          >
            <el-option label="yiPublish" value="active" />
            <el-option label="yiUnpublish" value="inactive" />
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleSearch" :loading="loading">
            <el-icon><Search /></el-icon>
            Search
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            zhong zhi
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- cao zuo an niu qu yu -->
    <el-card class="action-card">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        CreateProduct
      </el-button>
      <el-button type="success" @click="handleImport">
        <el-icon><Upload /></el-icon>
        BatchImport
      </el-button>
      <el-button type="warning" @click="handleExport">
        <el-icon><Download /></el-icon>
        ExportProduct
      </el-button>
    </el-card>
    
    <!-- ProductListbiao ge -->
    <el-card class="table-card">
      <el-table
        v-loading="loading"
        :data="products"
        stripe
        border
        style="width: 100%"
        @sort-change="handleSortChange"
      >
        <el-table-column type="selection" width="55" />
        
        <el-table-column prop="id" label="ID" width="80" />
        
        <el-table-column label="Producttu pian" width="100">
          <template #default="scope">
            <el-image
              v-if="scope.row.images && scope.row.images.length > 0"
              :src="scope.row.images[0].url || scope.row.images[0]"
              :preview-src-list="scope.row.images.map(img => img.url || img)"
              fit="cover"
              style="width: 60px; height: 60px"
            >
              <template #error>
                <div class="image-placeholder">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
            <div v-else class="image-placeholder">
              <el-icon><Picture /></el-icon>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="name" label="Productming cheng" min-width="150" />
        
        <el-table-column prop="category" label="Category" width="100">
          <template #default="scope">
            {{ scope.row.category?.name || 'weiCategory' }}
          </template>
        </el-table-column>
        
        <el-table-column prop="price" label="jia ge(yuan)" width="100">
          <template #default="scope">
            ¥{{ scope.row.price?.toFixed(2) }}
          </template>
        </el-table-column>
        
        <el-table-column prop="pointsRequired" label="suo xuPoints" width="100" />
        
        <el-table-column prop="stock" label="Stock" width="80" />
        
        <el-table-column prop="sales" label="xiao liang" width="80" sortable="custom" />
        
        <el-table-column label="Status" width="80">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
              {{ scope.row.status === 'active' ? 'yiPublish' : 'yiUnpublish' }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="createdAt" label="Createshi jian" width="160">
          <template #default="scope">
            {{ formatDateTime(scope.row.createdAt) }}
          </template>
        </el-table-column>
        
        <el-table-column label="cao zuo" width="200" fixed="right">
          <template #default="scope">
            <el-button
              link
              type="primary"
              size="small"
              @click="handleEdit(scope.row)"
            >
              Edit
            </el-button>
            <el-button
              link
              :type="scope.row.status === 'active' ? 'warning' : 'success'"
              size="small"
              @click="handleToggleStatus(scope.row)"
            >
              {{ scope.row.status === 'active' ? 'Unpublish' : 'Publish' }}
            </el-button>
            <el-button
              link
              type="info"
              size="small"
              @click="handleAdjustStock(scope.row)"
            >
              tiao zhengStock
            </el-button>
            <el-button
              link
              type="danger"
              size="small"
              @click="handleDelete(scope.row)"
            >
              Delete
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- Pagination -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.limit"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- tiao zhengStockdui hua kuang -->
    <el-dialog
      v-model="stockDialogVisible"
      title="tiao zhengStock"
      width="400px"
    >
      <el-form :model="stockForm" :rules="stockRules" ref="stockFormRef">
        <el-form-item label="dang qianStock">
          <el-input v-model="stockForm.currentStock" disabled />
        </el-form-item>
        <el-form-item label="xinStock" prop="stock">
          <el-input-number
            v-model="stockForm.stock"
            :min="0"
            :max="99999"
            controls-position="right"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="stockDialogVisible = false">qu xiao</el-button>
        <el-button type="primary" @click="handleConfirmStock" :loading="loading">
          que ding
        </el-button>
      </template>
    </el-dialog>
    
    <!-- ProductImportdui hua kuang -->
    <el-dialog
      v-model="importDialogVisible"
      title="BatchImportProduct"
      width="500px"
    >
      <div class="import-tips">
        <p>qing an zhao mu ban ge shiUploadExcelwen jian，zhi chi.xlsxge shi</p>
        <el-link type="primary" @click="handleDownloadTemplate">DownloadImport Template</el-link>
      </div>
      <el-upload
        ref="uploadRef"
        :auto-upload="false"
        :limit="1"
        accept=".xlsx,.xls"
        drag
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          jiang wen jian tuo dao ci chu，huo<em>dian jiUpload</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            zhi nengUploadxlsx/xlswen jian，qie bu chao guo10MB
          </div>
        </template>
      </el-upload>
      <template #footer>
        <el-button @click="importDialogVisible = false">qu xiao</el-button>
        <el-button type="primary" @click="handleConfirmImport" :loading="loading">
          Import
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus, Upload, Download, Picture, UploadFilled } from '@element-plus/icons-vue'
import { useProductStore } from '@/stores/product'
import { apiAdminProduct } from '@/api/product'

// Store
const productStore = useProductStore()

// xiang ying shi shu ju
const loading = computed(() => productStore.loading)
const products = computed(() => productStore.products)
const categories = computed(() => productStore.categories)
const pagination = computed(() => productStore.pagination)

const filters = reactive({
  keyword: '',
  categoryId: '',
  status: ''
})

const stockDialogVisible = ref(false)
const importDialogVisible = ref(false)
const stockFormRef = ref()
const uploadRef = ref()

const stockForm = reactive({
  id: null,
  currentStock: 0,
  stock: 0
})

const stockRules = {
  stock: [
    { required: true, message: 'qing shu ruStockshu liang', trigger: 'blur' },
    { type: 'number', min: 0, message: 'Stockbu neng xiao yu0', trigger: 'blur' }
  ]
}

// fang fa
const formatDateTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

const getImageUrl = (image) => {
  if (!image) return ''
  
  // ru guo shi dui xiang，huo quURLshu xing
  const url = typeof image === 'object' ? image.url : image
  
  // zhi jie fan huiBackendti gong de wan zhengURL
  return url
}

const handleSearch = () => {
  productStore.filters = { ...filters }
  productStore.fetchProducts()
}

const handleReset = () => {
  Object.assign(filters, {
    keyword: '',
    categoryId: '',
    status: ''
  })
  productStore.filters = { ...filters }
  productStore.fetchProducts()
}

const handleSortChange = ({ prop, order }) => {
  productStore.sort = { prop, order }
  productStore.fetchProducts()
}

const handleSizeChange = (size) => {
  productStore.pagination.limit = size
  productStore.fetchProducts()
}

const handleCurrentChange = (page) => {
  productStore.pagination.page = page
  productStore.fetchProducts()
}

const handleAdd = () => {
  // tiao zhuan daoCreateProductye mian
  emit('add')
}

const handleEdit = (row) => {
  // tiao zhuan daoEditProductye mian
  emit('edit', row)
}

const handleToggleStatus = async (row) => {
  const action = row.status === 'active' ? 'Unpublish' : 'Publish'
  try {
    await ElMessageBox.confirm(`que ding yao${action}Product"${row.name}"ma？`, 'que ren cao zuo', {
      confirmButtonText: 'que ding',
      cancelButtonText: 'qu xiao',
      type: 'warning'
    })
    
    const newStatus = row.status === 'active' ? 'inactive' : 'active'
    const result = await productStore.updateProductStatus(row.id, newStatus)
    
    if (result.success) {
      ElMessage.success(result.message)
    }
  } catch (error) {
    // Userqu xiao cao zuo
  }
}

const handleAdjustStock = (row) => {
  stockForm.id = row.id
  stockForm.currentStock = row.stock
  stockForm.stock = row.stock
  stockDialogVisible.value = true
}

const handleConfirmStock = async () => {
  if (!stockFormRef.value) return
  
  try {
    await stockFormRef.value.validate()
    const result = await productStore.updateProductStock(stockForm.id, stockForm.stock)
    
    if (result.success) {
      ElMessage.success(result.message)
      stockDialogVisible.value = false
    }
  } catch (error) {
    console.error('tiao zhengStockFailed:', error)
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `que ding yaoDeleteProduct"${row.name}"ma？Deletehou bu ke hui fu！`,
      'que renDelete',
      {
        confirmButtonText: 'que ding',
        cancelButtonText: 'qu xiao',
        type: 'warning'
      }
    )
    
    const result = await productStore.deleteProduct(row.id)
    
    if (result.success) {
      ElMessage.success(result.message)
    }
  } catch (error) {
    // Userqu xiao cao zuo
  }
}

const handleImport = () => {
  importDialogVisible.value = true
}

const handleExport = async () => {
  try {
    const response = await apiAdminProduct.exportProducts(filters)
    
    // CreateDownloadlian jie
    const blob = new Blob([response], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `ProductList_${new Date().toISOString().slice(0, 10)}.xlsx`
    link.click()
    window.URL.revokeObjectURL(url)
    
    ElMessage.success('ExportSucceeded')
  } catch (error) {
    console.error('ExportFailed:', error)
    ElMessage.error('ExportFailed')
  }
}

const handleDownloadTemplate = () => {
  // DownloadImport Template
  ElMessage.info('mu banDownloadgong nengIn Development')
}

const handleConfirmImport = async () => {
  if (!uploadRef.value) return
  
  const file = uploadRef.value.uploadFiles[0]
  if (!file) {
    ElMessage.warning('qing xuan ze yaoImportde wen jian')
    return
  }
  
  const formData = new FormData()
  formData.append('file', file.raw)
  
  try {
    await apiAdminProduct.importProducts(formData)
    ElMessage.success('ImportSucceeded')
    importDialogVisible.value = false
    productStore.fetchProducts()
  } catch (error) {
    console.error('ImportFailed:', error)
    ElMessage.error('ImportFailed')
  }
}

// shi jian ding yi
const emit = defineEmits(['add', 'edit'])

// sheng ming zhou qi
onMounted(() => {
  productStore.fetchCategories()
  productStore.fetchProducts()
})
</script>

<style scoped>
.product-list {
  padding: 20px;
}

.filter-card,
.action-card,
.table-card {
  margin-bottom: 20px;
}

.filter-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.image-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  background-color: #f5f7fa;
  color: #909399;
  font-size: 24px;
}

.import-tips {
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
}
</style>