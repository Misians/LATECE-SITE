<template lang="pug">
    .register-container
      .card
        h1 Novo Usuário
        
        form(@submit.prevent="handleRegister")
          // Dados do Novo Usuário
          .form-group
            label Usuário
            input(v-model="form.username" type="text" required)
          
          .form-group
            label Email
            input(v-model="form.email" type="email" required)
          
          .form-group
            label Senha do Novo Usuário
            input(v-model="form.password" type="password" required)
    
          .form-group
            label Função (Role)
            select(v-model="form.role")
              option(value="user") Usuário Comum
              option(value="admin") Administrador
          
          hr 
    
          // Campo de Segurança
          .form-group.admin-key
            label 🔐 Senha Mestra (Autorização)
            input(v-model="form.adminKey" type="password" placeholder="Digite a chave de administrador" required)
    
          button(:disabled="isLoading" type="submit") 
            | {{ isLoading ? 'Criando...' : 'Cadastrar Usuário' }}
    
        p.error(v-if="errorMessage") {{ errorMessage }}
        p.success(v-if="successMessage") {{ successMessage }}
    </template>
    
    <script setup>
    const form = ref({
      username: '',
      email: '',
      password: '',
      role: 'user',
      adminKey: '' // A chave mestra vai aqui
    })
    
    const isLoading = ref(false)
    const errorMessage = ref('')
    const successMessage = ref('')
    
    const handleRegister = async () => {
      isLoading.value = true
      errorMessage.value = ''
      successMessage.value = ''
    
      try {
        await $fetch('/api/admin/create-user', {
          method: 'POST',
          body: form.value
        })
        
        successMessage.value = `Usuário ${form.value.username} criado com sucesso!`
        // Limpa senhas
        form.value.password = ''
        form.value.adminKey = ''
      } catch (err) {
        errorMessage.value = err.data?.statusMessage || 'Erro ao criar usuário'
      } finally {
        isLoading.value = false
      }
    }
    </script>
    
    <style scoped>
    .register-container { display: flex; justify-content: center; padding: 50px; }
    .card { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); width: 100%; max-width: 400px; }
    .form-group { margin-bottom: 1rem; display: flex; flex-direction: column; }
    input, select { padding: 8px; border: 1px solid #ddd; border-radius: 6px; margin-top: 5px; }
    button { width: 100%; padding: 10px; background: #1D8A9F; color: white; border: none; border-radius: 6px; cursor: pointer; margin-top: 1rem; }
    button:disabled { opacity: 0.7; }
    .admin-key input { border-color: #fca5a5; background: #fef2f2; }
    .error { color: red; margin-top: 10px; text-align: center; }
    .success { color: green; margin-top: 10px; text-align: center; }
    </style>