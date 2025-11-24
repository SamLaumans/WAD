using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace officecallendar.backend.Migrations
{
    /// <inheritdoc />
    public partial class RoomAndBookingsEdit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RoomBookings_Rooms_Roomid",
                table: "RoomBookings");

            migrationBuilder.DropTable(
                name: "RoomBookingRoom");

            migrationBuilder.DropIndex(
                name: "IX_RoomBookings_Roomid",
                table: "RoomBookings");

            migrationBuilder.DropColumn(
                name: "Roomid",
                table: "RoomBookings");

            migrationBuilder.AddColumn<bool>(
                name: "visible",
                table: "Rooms",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<Guid>(
                name: "event_id",
                table: "RoomBookings",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AddColumn<bool>(
                name: "visible",
                table: "RoomBookings",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_RoomBookings_room_id",
                table: "RoomBookings",
                column: "room_id");

            migrationBuilder.AddForeignKey(
                name: "FK_RoomBookings_Rooms_room_id",
                table: "RoomBookings",
                column: "room_id",
                principalTable: "Rooms",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RoomBookings_Rooms_room_id",
                table: "RoomBookings");

            migrationBuilder.DropIndex(
                name: "IX_RoomBookings_room_id",
                table: "RoomBookings");

            migrationBuilder.DropColumn(
                name: "visible",
                table: "Rooms");

            migrationBuilder.DropColumn(
                name: "visible",
                table: "RoomBookings");

            migrationBuilder.AlterColumn<Guid>(
                name: "event_id",
                table: "RoomBookings",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "Roomid",
                table: "RoomBookings",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "RoomBookingRoom",
                columns: table => new
                {
                    booking_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    room_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoomBookingRoom", x => new { x.booking_id, x.room_id });
                    table.ForeignKey(
                        name: "FK_RoomBookingRoom_RoomBookings_booking_id",
                        column: x => x.booking_id,
                        principalTable: "RoomBookings",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RoomBookingRoom_Rooms_room_id",
                        column: x => x.room_id,
                        principalTable: "Rooms",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RoomBookings_Roomid",
                table: "RoomBookings",
                column: "Roomid");

            migrationBuilder.CreateIndex(
                name: "IX_RoomBookingRoom_room_id",
                table: "RoomBookingRoom",
                column: "room_id");

            migrationBuilder.AddForeignKey(
                name: "FK_RoomBookings_Rooms_Roomid",
                table: "RoomBookings",
                column: "Roomid",
                principalTable: "Rooms",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
