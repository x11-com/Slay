<template>
  <b-modal
    id="profile"
    size="lg"
    :hide-footer="true"
    :hide-header="true"
    @hide="beforeHide"
    @hidden="onHidden"
    @shown="onShown()"
  >
    <profile
      :user-id="userId"
      :starting-page="startingPage"
      style="margin-top:24px;"
    />
  </b-modal>
</template>

<style lang="scss" scoped>
  @import '~@/assets/scss/colors.scss';

  .header {
    width: 100%;
  }
</style>

<script>
import profile from './profile';

export default {
  components: {
    profile,
  },
  data () {
    return {
      userId: undefined,
      startingPage: undefined,
      path: undefined,
    };
  },
  mounted () {
    this.$root.$on('slay:show-profile', data => {
      this.userId = data.userId;
      this.startingPage = data.startingPage || 'profile';
      this.path = data.path;
      this.$root.$emit('bv::show::modal', 'profile');
    });
  },
  beforeDestroy () {
    this.$root.$off('slay:show-profile');
  },
  methods: {
    onShown () {
      window.history.pushState('', null, this.path);
    },
    beforeHide () {
      if (this.$route.path !== window.location.pathname) {
        this.$root.$emit('slay:restoreTitle');
      }
    },
    onHidden () {
      if (this.$route.path !== window.location.pathname) {
        this.$router.go(-1);
      }
    },
  },
};
</script>
