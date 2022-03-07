<template>
  CallRelation
  {{taskId}}
</template>

<script>
export default {
  props: ['taskId'],
  setup(props) {
    const { taskId } = props

    return {
      taskId
    }
  }
}
</script>

<style>

</style>
