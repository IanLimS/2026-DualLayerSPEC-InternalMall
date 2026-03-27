<template>
  <el-dialog
    v-model="dialogVisible"
    title="ProductCategoryguan li"
    width="600px"
  >
    <!-- CategoryList -->
    <div class="category-list">
      <el-button type="primary" @click="handleAddCategory">
        <el-icon><Plus /></el-icon>
        CreateCategory
      </el-button>
      
      <el-table
        :data="categories"
        border
        style="width: 100%; margin-top: 15px"
        row-key="id"
      >
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="name" label="Categoryming cheng" />
        <el-table-column prop="description" label="miao shu" />
        <el-table-column prop="sort" label="Sort" width="80" />
        <el-table-column label="Status" width="80">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
              {{ scope.row.status === 'active' ? 'Enable' : 'Disable' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="cao zuo" width="150">
          <template #default="scope">
            <el-button
              link
              type="primary"
              size="small"
              @click="handleEditCategory(scope.row)"
            >
              Edit
            </el-button>
            <el-button
              link
              :type="scope.row.status === 'active' ? 'warning' : 'success'"
              size="small"
              @click="handleToggleStatus(scope.row)"
            >
              {{ scope.row.status === 'active' ? 'Disable' : 'Enable' }}
            </el-button>
            <el-button
              link
              type="danger"
              size="small"
              @click="handleDeleteCategory(scope.row)"
            >
              Delete
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <!-- Categorybiao dan dui hua kuang -->
    <el-dialog
      v-model="categoryFormVisible"
      :title="isEditCategory ? 'EditCategory' : 'CreateCategory'"
      width="400px"
      append-to-body
    >
      <el-form
        ref="categoryFormRef"
        :model="categoryForm"
        :rules="categoryRules"
        label-width="80px"
      >
        <el-form-item label="Categoryming cheng" prop="name">
          <el-input v-model="categoryForm.name" placeholder="qing shu ruCategoryming cheng" />
        </el-form-item>
        <el-form-item label="Categorymiao shu" prop="description">
          <el-input
            v-model="categoryForm.description"
            type="textarea"
            rows="3"
            placeholder="qing shu ruCategorymiao shu"
          />
        </el-form-item>
        <el-form-item label="Sortquan zhong" prop="sort">
          <el-input-number
            v-model="categoryForm.sort"
            :min="0"
            controls-position="right"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="categoryFormVisible = false">qu xiao</el-button>
        <el-button type="primary" @click="handleSubmitCategory" :loading="loading">
          {{ isEditCategory ? 'Update' : 'Create' }}
        </el-button>
      </template>
    </el-dialog>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useProductStore } from '@/stores/product'

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['update:visible'])

// Store
const productStore = useProductStore()

// Computed
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const categories = computed(() => productStore.categories)
const loading = computed(() => productStore.loading)

// Refs
const categoryFormVisible = ref(false)
const categoryFormRef = ref()

// Reactive data
const isEditCategory = ref(false)
const currentCategoryId = ref(null)

const categoryForm = reactive({
  name: '',
  description: '',
  sort: 0
})

const categoryRules = {
  name: [
    { required: true, message: 'qing shu ruCategoryming cheng', trigger: 'blur' }
  ]
}

// Methods
const initCategoryForm = () => {
  Object.keys(categoryForm).forEach(key => {
    if (typeof categoryForm[key] === 'number') {
      categoryForm[key] = 0
    } else {
      categoryForm[key] = ''
    }
  })
}

const handleAddCategory = () => {
  isEditCategory.value = false
  currentCategoryId.value = null
  initCategoryForm()
  categoryFormVisible.value = true
}

const handleEditCategory = (row) => {
  isEditCategory.value = true
  currentCategoryId.value = row.id
  
  // tian chong biao dan shu ju
  Object.keys(categoryForm).forEach(key => {
    if (row[key] !== undefined) {
      categoryForm[key] = row[key]
    }
  })
  
  categoryFormVisible.value = true
}

const handleSubmitCategory = async () => {
  if (!categoryFormRef.value) return
  
  try {
    await categoryFormRef.value.validate()
    
    let result
    if (isEditCategory.value) {
      result = await productStore.updateCategory(currentCategoryId.value, categoryForm)
    } else {
      result = await productStore.createCategory(categoryForm)
    }
    
    if (result.success) {
      ElMessage.success(result.message || (isEditCategory.value ? 'UpdateSucceeded' : 'CreateSucceeded'))
      categoryFormVisible.value = false
    }
  } catch (error) {
    console.error('ti jiaoCategoryFailed:', error)
  }
}

const handleToggleStatus = async (row) => {
  const action = row.status === 'active' ? 'Disable' : 'Enable'
  try {
    await ElMessageBox.confirm(`que ding yao${action}Category"${row.name}"ma？`, 'que ren cao zuo', {
      confirmButtonText: 'que ding',
      cancelButtonText: 'qu xiao',
      type: 'warning'
    })
    
    const newStatus = row.status === 'active' ? 'inactive' : 'active'
    const result = await productStore.updateCategory(row.id, { ...row, status: newStatus })
    
    if (result.success) {
      ElMessage.success(`${action}Succeeded`)
    }
  } catch (error) {
    // Userqu xiao cao zuo
  }
}

const handleDeleteCategory = async (row) => {
  try {
    await ElMessageBox.confirm(
      `que ding yaoDeleteCategory"${row.name}"ma？Deletehou bu ke hui fu！`,
      'que renDelete',
      {
        confirmButtonText: 'que ding',
        cancelButtonText: 'qu xiao',
        type: 'warning'
      }
    )
    
    const result = await productStore.deleteCategory(row.id)
    
    if (result.success) {
      ElMessage.success('DeleteSucceeded')
    }
  } catch (error) {
    // Userqu xiao cao zuo
  }
}
</script>

<style scoped>
.category-list {
  max-height: 400px;
  overflow-y: auto;
}
</style>